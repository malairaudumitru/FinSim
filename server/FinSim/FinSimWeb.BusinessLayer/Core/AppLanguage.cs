using System.Globalization;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace FinSim.BusinessLayer.Core;

public static class AppLanguage
{
    public const string Romanian = "ro";
    public const string English = "en";
    public const string Russian = "ru";
    public const string Default = Romanian;

    private static readonly string[] Supported = [Romanian, English, Russian];
    
    public static string Parse(string? acceptLanguage)
    {
        if (string.IsNullOrWhiteSpace(acceptLanguage))
            return Default;

        var candidates = acceptLanguage
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select((part, index) =>
            {
                var pieces = part.Split(';', StringSplitOptions.TrimEntries);
                var tag = pieces[0].Split('-')[0].ToLowerInvariant();
                var quality = 1.0;
                var qPart = pieces.Skip(1).FirstOrDefault(p => p.StartsWith("q=", StringComparison.OrdinalIgnoreCase));
                if (qPart != null && double.TryParse(qPart[2..], NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed))
                    quality = parsed;
                return (tag, quality, index);
            })
            .Where(c => c.quality > 0 && Supported.Contains(c.tag))
            .OrderByDescending(c => c.quality)
            .ThenBy(c => c.index)
            .Select(c => c.tag);

        return candidates.FirstOrDefault() ?? Default;
    }

    public static string Pick(string language, string? ro, string? en, string? ru)
    {
        var preferred = language switch
        {
            English => en,
            Russian => ru,
            _ => ro
        };

        if (!string.IsNullOrWhiteSpace(preferred)) return preferred;
        if (!string.IsNullOrWhiteSpace(ro)) return ro;
        if (!string.IsNullOrWhiteSpace(en)) return en;
        return ru ?? string.Empty;
    }
    
    public static string LocalizeJson(string json, string language)
    {
        if (string.IsNullOrWhiteSpace(json))
            return json;

        JsonNode? root;
        try
        {
            root = JsonNode.Parse(json);
        }
        catch (JsonException)
        {
            return json;
        }

        if (root == null)
            return json;

        if (root is JsonObject rootObject && IsLocalizedText(rootObject))
            return JsonValue.Create(PickFrom(rootObject, language))!.ToJsonString();

        LocalizeChildren(root, language);
        return root.ToJsonString();
    }

    private static void LocalizeChildren(JsonNode node, string language)
    {
        if (node is JsonObject obj)
        {
            foreach (var (key, child) in obj.ToList())
            {
                if (child is JsonObject childObject && IsLocalizedText(childObject))
                    obj[key] = JsonValue.Create(PickFrom(childObject, language));
                else if (child != null)
                    LocalizeChildren(child, language);
            }
        }
        else if (node is JsonArray array)
        {
            for (var i = 0; i < array.Count; i++)
            {
                var child = array[i];
                if (child is JsonObject childObject && IsLocalizedText(childObject))
                    array[i] = JsonValue.Create(PickFrom(childObject, language));
                else if (child != null)
                    LocalizeChildren(child, language);
            }
        }
    }

    private static string PickFrom(JsonObject obj, string language) =>
        Pick(language, TextOf(obj, Romanian), TextOf(obj, English), TextOf(obj, Russian));

    private static bool IsLocalizedText(JsonObject obj) =>
        obj.Count > 0 &&
        obj.All(p => Supported.Contains(p.Key) && (p.Value == null || p.Value.GetValueKind() == JsonValueKind.String));

    private static string? TextOf(JsonObject obj, string key) =>
        obj.TryGetPropertyValue(key, out var value) ? value?.GetValue<string>() : null;
}
