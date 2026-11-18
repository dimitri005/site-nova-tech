package com.novatechsolution.media.service;

import com.novatechsolution.media.domain.MediaAsset;
import com.novatechsolution.media.dto.MediaAssetResponse;
import com.novatechsolution.media.repository.MediaAssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.ImageWriteParam;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class MediaService {
    private final MediaAssetRepository assets;
    @Value("${novatech.media.storage-path:./var/media}") private String storagePath;
    @Value("${novatech.media.max-bytes:10485760}") private long maxBytes;

    @Transactional
    public MediaAssetResponse upload(MultipartFile file, String altFr, String altEn) {
        if (file == null || file.isEmpty() || file.getSize() > maxBytes)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image vide ou supérieure à la taille maximale.");
        String declared = file.getContentType();
        try {
            byte[] originalBytes = file.getBytes();
            boolean pngSignature = originalBytes.length >= 8 && originalBytes[0] == (byte) 0x89
                    && originalBytes[1] == 0x50 && originalBytes[2] == 0x4e && originalBytes[3] == 0x47
                    && originalBytes[4] == 0x0d && originalBytes[5] == 0x0a
                    && originalBytes[6] == 0x1a && originalBytes[7] == 0x0a;
            boolean jpegSignature = originalBytes.length >= 3 && originalBytes[0] == (byte) 0xff
                    && originalBytes[1] == (byte) 0xd8 && originalBytes[2] == (byte) 0xff;
            if (!pngSignature && !jpegSignature)
                throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Le type MIME ne correspond pas au contenu réel du fichier.");
            String extension = pngSignature ? "png" : "jpg";
            if (declared != null && !declared.isBlank()
                    && !(pngSignature && "image/png".equalsIgnoreCase(declared))
                    && !(jpegSignature && ("image/jpeg".equalsIgnoreCase(declared) || "image/jpg".equalsIgnoreCase(declared))))
                throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Le type MIME ne correspond pas au contenu réel du fichier.");
            BufferedImage image;
            try (ImageInputStream input = ImageIO.createImageInputStream(new java.io.ByteArrayInputStream(originalBytes))) {
                Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
                if (!readers.hasNext()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le fichier ne contient pas une image prise en charge.");
                ImageReader reader = readers.next();
                try {
                    reader.setInput(input, true, true);
                    int width = reader.getWidth(0); int height = reader.getHeight(0);
                    if (width < 1 || height < 1 || width > 12000 || height > 12000 || (long) width * height > 16_000_000L)
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Les dimensions de l'image dépassent la limite acceptée.");
                    image = reader.read(0);
                } finally { reader.dispose(); }
            }
            if (image == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le fichier ne contient pas une image prise en charge.");
            String actual = "png".equals(extension) ? "image/png" : "image/jpeg";
            BufferedImage optimized = resize(image, 1920);
            byte[] bytes = encode(optimized, actual.equals("image/png") ? "png" : "jpg");
            String storageName = UUID.randomUUID() + (actual.equals("image/png") ? ".png" : ".jpg");
            Path directory = Path.of(storagePath).toAbsolutePath().normalize();
            Files.createDirectories(directory);
            Files.write(directory.resolve(storageName), bytes);
            MediaAsset asset = new MediaAsset(); asset.setStorageName(storageName);
            asset.setOriginalName(safeName(file.getOriginalFilename())); asset.setContentType(actual);
            asset.setFileSize(bytes.length); asset.setAltFr(clean(altFr)); asset.setAltEn(clean(altEn));
            return MediaAssetResponse.from(assets.save(asset));
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de lire ou d'optimiser cette image.");
        }
    }

    @Transactional(readOnly = true)
    public List<MediaAssetResponse> list() { return assets.findAllByOrderByCreatedAtDesc().stream().map(MediaAssetResponse::from).toList(); }

    @Transactional
    public void delete(UUID id) {
        MediaAsset asset = assets.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Média introuvable."));
        Path file = Path.of(storagePath).toAbsolutePath().normalize().resolve(asset.getStorageName()).normalize();
        if (!file.getParent().equals(Path.of(storagePath).toAbsolutePath().normalize()))
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Chemin du média invalide.");
        try { Files.deleteIfExists(file); } catch (IOException exception) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Suppression du fichier impossible."); }
        assets.delete(asset);
    }

    private BufferedImage resize(BufferedImage source, int maxDimension) {
        double ratio = Math.min(1d, (double) maxDimension / Math.max(source.getWidth(), source.getHeight()));
        int width = Math.max(1, (int) Math.round(source.getWidth() * ratio));
        int height = Math.max(1, (int) Math.round(source.getHeight() * ratio));
        int type = source.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage target = new BufferedImage(width, height, type);
        var graphics = target.createGraphics();
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        graphics.drawImage(source, 0, 0, width, height, null); graphics.dispose();
        return target;
    }
    private byte[] encode(BufferedImage image, String format) throws IOException {
        Iterator<javax.imageio.ImageWriter> writers = ImageIO.getImageWritersByFormatName(format);
        if (!writers.hasNext()) throw new IOException("No image encoder for " + format);
        var writer = writers.next();
        try (ByteArrayOutputStream output = new ByteArrayOutputStream(); var stream = ImageIO.createImageOutputStream(output)) {
            writer.setOutput(stream); ImageWriteParam params = writer.getDefaultWriteParam();
            if (params.canWriteCompressed()) { params.setCompressionMode(ImageWriteParam.MODE_EXPLICIT); params.setCompressionQuality(format.equals("jpg") ? .82f : .75f); }
            writer.write(null, new IIOImage(image, null, null), params); stream.flush(); return output.toByteArray();
        } finally { writer.dispose(); }
    }
    private String safeName(String original) {
        String name = original == null ? "image" : Path.of(original.replace('\\', '/')).getFileName().toString();
        String cleaned = name.replaceAll("[^A-Za-z0-9._-]", "_");
        return cleaned.length() > 240 ? cleaned.substring(cleaned.length() - 240) : cleaned;
    }
    private String clean(String value) { return value == null ? null : value.trim().substring(0, Math.min(300, value.trim().length())); }
}
