-- Répare les anciennes URL de démonstration contenant une apostrophe à la place de ?.
-- Ne remplace aucune image personnalisée valide.
UPDATE site_setting_values
SET setting_value = replace(setting_value, '''auto=format', '?auto=format')
WHERE settings_id = 'default'
  AND setting_key LIKE 'home.%.image%'
  AND setting_value LIKE '%''auto=format%';
