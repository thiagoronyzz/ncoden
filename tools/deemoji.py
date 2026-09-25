#!/usr/bin/env python3
"""NCODE N — deemoji: remove emojis dos jogos e substitui por elementos sólidos.

  - sprites de canvas (fillText/strokeText/measureText) -> token 'i:nome',
    renderizado pela biblioteca de ícones vetoriais do shell.js;
  - literais solo usados também como sprite (comparações) -> 'i:nome' também,
    para manter consistência lógica dentro do arquivo;
  - texto de interface -> glifos tipográficos (✔ ✕ ★ ♥ ● ■ ↑ →) ou remoção limpa;
  - injeta o mapa emoji→ícone no shell.js (rede de segurança em runtime).

Uso: python3 tools/deemoji.py [--dry]"""
import re, sys, glob, os, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# cluster de emoji: base + seletores de variação, emendados apenas por ZWJ
EMOJI_CLUSTER = re.compile(
    "[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2300-\u23FF\uFE0F]"
    "(?:\uFE0F)?"
    "(?:\u200D[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\u2300-\u23FF](?:\uFE0F)?)*"
)
KEEP_CL = re.compile(
    "^[\u2605\u2606\u2660-\u2667\u2654-\u265F\u2680-\u2685"
    "\u2190-\u21FF\u2713\u2714\u2715\u2716\u2717\u2718"
    "\u25B2\u25BC\u25C0\u25B6\u25CF\u25CB\u25A0\u25A1\u2610\u2611\u2022]$"
)

def canon(cluster):
    return cluster.replace("\ufe0f", "").replace("\u200d", "")

# ---- glifos tipográficos para TEXTO de interface ----
GLYPH = {
    "\u2705": "\u2714", "\u274C": "\u2715", "\u2716": "\u2715",
    "\u2B50": "\u2605",
    "\u2764": "\u2665", "\U0001F49A": "\u2665", "\U0001F499": "\u2665",
    "\U0001F49B": "\u2665", "\U0001F49C": "\u2665", "\U0001F5A4": "\u2665",
    "\U0001F494": "\u2665", "\U0001F498": "\u2665", "\U0001F493": "\u2665",
    "\U0001F496": "\u2665", "\U0001F497": "\u2665",
    "\u2B06": "\u2191", "\u2B05": "\u2190", "\u27A1": "\u2192", "\u2B07": "\u2193",
    "\u23E9": "\u2192", "\u23EA": "\u2190", "\u23EB": "\u2912", "\u23EC": "\u2913",
    "\U0001F53C": "\u2191", "\U0001F53D": "\u2193", "\U0001F446": "\u2191",
    "\U0001F447": "\u2193", "\U0001F448": "\u2190", "\U0001F449": "\u2192",
    "\u261D": "\u2191",
    "\u2B55": "\u25CB", "\u25EF": "\u25CB", "\u26AA": "\u25CB",
    "\u26AB": "\u25CF", "\U0001F7E2": "\u25CF", "\U0001F534": "\u25CB", "\U0001F535": "\u25CB",
    "\U0001F7E1": "\u25CF", "\U0001F7E0": "\u25CF", "\U0001F7E4": "\u25CF",
    "\U0001F7E3": "\u25CB",
    "\U0001F7E9": "\u25A0", "\U0001F7EB": "\u25A0", "\U0001F7E8": "\u25A0",
    "\U0001F7EA": "\u25A0", "\U0001F7E6": "\u25A0", "\U0001F7E5": "\u25A0",
    "\u2B1B": "\u25A0", "\u2B1C": "\u25A1", "\u25FC": "\u25A0", "\u25FB": "\u25A1",
    "\u2757": "!", "\u2753": "?", "\u2754": "?",
    "\u279C": "\u2192", "\u21A9": "\u2190", "\u21BB": "\u21BB",

    "\u26D4": "\u2715", "\U0001F6AB": "\u2715", "\u26A0": "",
    "\u2668": "", "\u2728": "", "\U0001F506": "", "\U0001F505": "",
    "\U0001F504": "\u21BB", "\U0001F501": "\u21BB", "\U0001F503": "\u21BB",
}

# ---- emoji -> ícone vetorial (nomes da biblioteca em shell.js) ----
ICON = {
    # pessoas / criaturas
    "\U0001F9CD": "person", "\U0001F9D1": "person", "\U0001F9D2": "baby", "\U0001F476": "baby",
    "\U0001F6B6": "walk", "\U0001F3C3": "run", "\U0001F938": "acrobat", "\U0001F9D7": "climb",
    "\U0001F3CA": "swim", "\U0001F57A": "dance", "\U0001F483": "dance", "\U0001F46F": "dance",
    "\U0001F64B": "raise", "\U0001F64C": "clap", "\U0001F44F": "clap", "\U0001F939": "juggle",
    "\U0001F935": "suit", "\U0001F574": "suit", "\U0001F482": "guard", "\U0001F575": "detective",
    "\U0001F9DF": "zombie", "\U0001F977": "zombie", "\U0001F916": "robot", "\U0001F47B": "ghost",
    "\U0001F47F": "ghost", "\U0001F47D": "robot", "\U0001F47E": "robot", "\U0001F9DA": "detective",
    "\U0001F9D9": "detective", "\U0001F9DB": "detective", "\U0001F9DC": "person", "\U0001F9DD": "person",
    "\U0001F47A": "ghost", "\U0001F9B4": "bone", "\U0001F9CD\u200D\u2640": "person",
    "\U0001F9CD\u200D\u2642": "person", "\U0001F3C3\u200D\u2640": "run", "\U0001F3C3\u200D\u2642": "run",
    "\U0001F9CE": "run", "\U0001F9CE\u200D\u2640": "run", "\U0001F9CE\u200D\u2642": "run",
    "\U0001F9CD\u200D\U0001F9AF": "walk", "\U0001F9D1\u200D\U0001F91D\u200D\U0001F9D1": "person",
    "\U0001F464": "person", "\U0001F465": "person", "\U0001F46E": "guard", "\U0001F977": "zombie",
    "\U0001F3CB": "suit", "\U0001F3CB\u200D\u2640": "suit", "\U0001F3CB\u200D\u2642": "suit",
    "\U0001F93C": "suit", "\U0001F93C\u200D\u2640": "suit", "\U0001F93C\u200D\u2642": "suit",
    "\U0001F938\u200D\u2640": "acrobat", "\U0001F938\u200D\u2642": "acrobat",
    "\U0001F93D": "swim", "\U0001F93D\u200D\u2640": "swim", "\U0001F93D\u200D\u2642": "swim",
    "\U0001F939\u200D\u2640": "juggle", "\U0001F939\u200D\u2642": "juggle",
    "\U0001F9D8": "person", "\U0001F64F": "raise", "\U0001F91D": "person",
    "\U0001F44D": "raise", "\U0001F44C": "raise", "\U0001F44A": "raise", "\U0001F91A": "raise",
    "\U0001F590": "raise", "\u270B": "raise", "\u270A": "raise", "\u270C": "raise", "\U0001F91F": "raise",
    "\U0001F9D9\u200D\u2640": "detective", "\U0001F9D9\u200D\u2642": "detective",
    "\U0001F469\u200D\U0001F3EB": "suit", "\U0001F468\u200D\U0001F3EB": "suit",
    "\U0001F469\u200D\U0001F4BB": "suit", "\U0001F468\u200D\U0001F4BB": "suit",
    "\U0001F469\u200D\U0001F52C": "detective", "\U0001F468\u200D\U0001F52C": "detective",
    "\U0001F469\u200D\U0001F692": "guard", "\U0001F468\u200D\U0001F692": "guard",
    "\U0001F469\u200D\u2695": "suit", "\U0001F468\u200D\u2695": "suit",
    "\U0001F469\u200D\U0001F33E": "suit", "\U0001F468\u200D\U0001F33E": "suit",
    "\U0001F469\u200D\U0001F373": "suit", "\U0001F468\u200D\U0001F373": "suit",
    "\U0001F469\u200D\U0001F680": "suit", "\U0001F468\u200D\U0001F680": "suit",
    "\U0001F9D1\u200D\U0001F393": "suit", "\U0001F9D1\u200D\U0001F3EB": "suit",
    "\U0001F9D1\u200D\U0001F4BB": "suit", "\U0001F9D1\u200D\U0001F52C": "detective",
    "\U0001F9D1\u200D\U0001F680": "suit", "\U0001F9D1\u200D\U0001F373": "suit",
    "\U0001F9D1\u200D\u2695": "suit", "\U0001F9D1\u200D\U0001F3ED": "suit",
    "\U0001F9D1\u200D\U0001F33E": "suit", "\U0001F9D1\u200D\U0001F527": "suit",
    "\U0001F9D1\u200D\U0001F3A8": "suit",
    "\U0001F912": "person", "\U0001F915": "person", "\U0001F922": "person", "\U0001F92E": "person",
    "\U0001F924": "person", "\U0001F60C": "person", "\U0001F611": "person", "\U0001F636": "person",
    "\U0001F642": "person", "\U0001F600": "person", "\U0001F602": "person", "\U0001F60B": "person",
    "\U0001F62D": "person", "\U0001F631": "person", "\U0001F620": "person", "\U0001F621": "person",
    "\U0001F632": "person", "\U0001F633": "person", "\U0001F60F": "person", "\U0001F643": "person",
    "\U0001F64D": "person", "\U0001F64E": "person", "\U0001F637": "person", "\U0001F9D0": "person",
    "\U0001F9D4": "person", "\U0001F471": "person", "\U0001F4AA": "suit", "\U0001F9BE": "suit",
    "\U0001F57A": "dance",
    # veículos
    "\U0001F697": "car", "\U0001F698": "car", "\U0001F695": "car", "\U0001F694": "car",
    "\U0001F693": "car", "\U0001F696": "car", "\U0001F699": "car", "\U0001F6FB": "car",
    "\U0001F69B": "truck", "\U0001F69A": "truck", "\U0001F692": "truck", "\U0001F68C": "truck",
    "\U0001F68D": "truck", "\U0001F68E": "truck", "\U0001F690": "truck", "\U0001F691": "ambulance",
    "\U0001F6B2": "bike", "\U0001F6B4": "bike", "\U0001F6B4\u200D\u2640": "bike",
    "\U0001F6B4\u200D\u2642": "bike", "\U0001F6B5": "bike", "\U0001F6B5\u200D\u2640": "bike",
    "\U0001F6B5\u200D\u2642": "bike", "\U0001F3CC": "bike", "\U0001F3CC\u200D\u2640": "bike",
    "\U0001F3CC\u200D\u2642": "bike",
    "\U0001F3CD": "moto", "\U0001F6F5": "scooter", "\U0001F6F4": "scooter", "\U0001F6F9": "skate",
    "\U0001F69C": "tractor", "\U0001F682": "train", "\U0001F683": "wagon", "\U0001F684": "train",
    "\U0001F686": "train", "\U0001F688": "train", "\U0001F685": "train",
    "\U0001F3CE": "kart", "\U0001F3C1": "flag", "\U0001F681": "heli", "\u2708": "plane",
    "\U0001F6EB": "plane", "\U0001F6EC": "plane", "\U0001F6A4": "boat", "\u26F5": "boat",
    "\U0001F680": "rocket", "\U0001F6F7": "sled", "\U0001F3BF": "ski", "\u26F7": "ski",
    "\U0001F6FC": "sled", "\U0001F3CA\u200D\u2640": "swim", "\U0001F3CA\u200D\u2642": "swim",
    "\U0001F6F6": "canoe", "\U0001F6F0": "satellite", "\U0001F6FA": "truck", "\U0001F6CD": "box",
    "\U0001F9F3": "box", "\U0001F683\u200D\U0001F683": "wagon",
    # natureza
    "\U0001F333": "tree", "\U0001F332": "pine", "\U0001F334": "palm", "\U0001F331": "sprout",
    "\U0001F33F": "leaf", "\U0001F342": "leaf", "\U0001F343": "leaf", "\U0001F33E": "wheat",
    "\U0001F33D": "wheat", "\U0001F338": "flower", "\U0001F339": "flower", "\U0001F33B": "flower",
    "\U0001F337": "flower", "\U0001F490": "flower", "\U0001F33A": "flower",
    "\U0001FAB6": "flower", "\U0001FAB7": "flower", "\U0001F344": "mushroom",
    "\U0001F30B": "volcano", "\U0001F30A": "wave", "\U0001F4A7": "drop", "\U0001F4A6": "splash",
    "\U0001F9F4": "drop", "\U0001FA79": "drop", "\U0001F489": "drop", "\U0001F48A": "drop",
    "\U0001F95B": "drop", "\u2615": "drop", "\U0001F375": "drop", "\U0001F964": "drop",
    "\U0001F9CB": "drop", "\U0001F9C3": "drop",
    "\U0001F525": "flame", "\U0001F4A8": "smoke", "\u2600": "sun", "\U0001F319": "moon",
    "\u26A1": "bolt",
    "\u26C5": "cloud", "\u2601": "cloud", "\U0001F324": "cloud", "\u2744": "snow",
    "\u26C4": "snow", "\U0001F328": "snow", "\U0001F32A": "tornado", "\u2604": "meteor",
    "\u26F0": "mountain", "\U0001F3D4": "mountain", "\U0001F5FB": "mountain",
    "\U0001F3DD": "umbrella", "\U0001F3D6": "umbrella", "\u26F1": "umbrella",
    "\U0001F335": "cactus", "\U0001FAB8": "coral", "\U0001FA90": "planet",
    "\U0001F30E": "earth", "\U0001F30D": "earth", "\U0001F32B": "smoke",
    "\U0001F327": "drop", "\U0001F329": "warning", "\U0001F326": "drop", "\U0001F308": "",
    "\U0001F32C": "smoke", "\U0001F4A8": "smoke",
    # animais
    "\U0001F415": "dog", "\U0001F436": "dog", "\U0001F43A": "dog", "\U0001F9A9": "dog",
    "\U0001F429": "dog", "\U0001F98A": "dog", "\U0001F43B": "dog",
    "\U0001F408": "cat", "\U0001F431": "cat", "\U0001F42F": "cat", "\U0001F981": "cat",
    "\U0001F406": "cat", "\U0001F42D": "mouse", "\U0001F430": "mouse", "\U0001F407": "mouse",
    "\U0001F428": "mouse", "\U0001F438": "frog", "\U0001F425": "chick", "\U0001F414": "chick",
    "\U0001F423": "chick", "\U0001F424": "chick", "\U0001F427": "penguin",
    "\U0001F411": "sheep", "\U0001F410": "sheep", "\U0001F41C": "ant", "\U0001F40A": "croc",
    "\U0001F994": "turtle", "\U0001F422": "turtle", "\U0001F420": "fish", "\U0001F41F": "fish",
    "\U0001F988": "shark", "\U0001F419": "octopus", "\U0001F980": "crab",
    "\U0001F9AA": "shellfish", "\U0001F40D": "snake", "\U0001F98B": "butterfly",
    "\U0001F41D": "bee", "\U0001F577": "spider", "\U0001F426": "bird", "\U0001F985": "bird",
    "\U0001F989": "bird", "\U0001F98C": "horse", "\U0001F40E": "horse", "\U0001F3C7": "horse",
    "\U0001F418": "turtle", "\U0001F98B": "butterfly", "\U0001F98D": "dog",
    # objetos
    "\U0001F6AA": "door", "\U0001F6A9": "pennant", "\U0001F3AF": "target", "\U0001F48E": "gem",
    "\U0001FA99": "coin", "\u26BD": "ball", "\u26BE": "ball", "\U0001F3D0": "ball",
    "\U0001F3BE": "ball", "\U0001F4B0": "money", "\U0001F4B8": "money", "\U0001F4B5": "money",
    "\U0001F4B4": "money", "\u2B55": "target", "\U0001F511": "key", "\U0001F512": "lock",
    "\U0001F513": "lock", "\U0001F50F": "lock", "\U0001F4E6": "box", "\U0001F381": "box",
    "\U0001F6E2": "barrel", "\u26FD": "barrel", "\U0001FAA7": "barrel", "\U0001F3FA": "pot",
    "\U0001F9FA": "basket", "\U0001FAA3": "bucket", "\U0001FAA8": "box", "\U0001F6E0": "wrench",
    "\U0001F527": "wrench", "\U0001F528": "hammer", "\u26CF": "pick", "\U0001FA93": "axe",
    "\u2702": "scissors", "\U0001F9F5": "scissors", "\U0001F9F6": "rope", "\U0001FAA2": "rope",
    "\U0001F517": "chain", "\U0001F9F1": "brick", "\U0001F9CA": "ice", "\U0001FAB5": "log",
    "\U0001F9F8": "teddy", "\U0001F514": "bell", "\U0001F6A8": "siren", "\u2699": "gear",
    "\u2692": "hammer", "\u2694": "sword", "\U0001F5E1": "sword", "\U0001F6E1": "shield",
    "\u2620": "skull", "\U0001F480": "skull", "\u2764": "heart", "\U0001F49A": "heart",
    "\u2705": "check", "\u2714": "check", "\u274C": "cross", "\u26D4": "cross",
    "\u26A0": "warning", "\u2757": "warning", "\U0001F6C2": "guard", "\U0001F6A7": "warning",
    "\u2753": "question", "\u2754": "question", "\U0001F3B2": "dice", "\U0001F3B0": "dice",
    "\U0001F3C6": "trophy", "\U0001F451": "crown", "\u265A": "crown", "\u265B": "crown",
    "\u2654": "crown", "\u2655": "crown", "\u2656": "crown", "\u2657": "crown",
    "\U0001F947": "medal", "\U0001F396": "medal", "\U0001F397": "medal", "\U0001F3C5": "medal",
    "\U0001F94B": "medal", "\U0001F4A1": "bulb", "\U0001F4F8": "camera", "\U0001F4F7": "camera",
    "\U0001F3A5": "camera", "\U0001F39E": "camera", "\U0001F3AC": "camera",
    "\U0001F5A5": "tv", "\U0001F5B5": "tv", "\U0001F56F": "candle", "\U0001F56E": "candle",
    "\U0001F50A": "speaker", "\U0001F509": "speaker", "\U0001F508": "speaker",
    "\U0001F507": "speaker", "\U0001F4E2": "speaker", "\U0001F4E3": "speaker",
    "\U0001F52D": "telescope", "\U0001F52C": "microscope", "\U0001F9EA": "microscope",
    "\u269B": "microscope", "\U0001F9EB": "microscope", "\U0001F5C4": "cabinet",
    "\U0001F6CB": "cabinet", "\U0001F5C2": "clipboard", "\U0001F4CB": "clipboard",
    "\U0001F4DD": "clipboard", "\U0001F4C3": "clipboard", "\U0001F4C4": "clipboard",
    "\U0001F4D6": "book", "\U0001F4D5": "book", "\U0001F4D7": "book", "\U0001F4D8": "book",
    "\U0001F4D9": "book", "\U0001F4D2": "book", "\U0001F4D3": "book", "\U0001F4D1": "book",
    "\U0001F4DA": "book", "\U0001F393": "book", "\U0001F524": "letters", "\U0001F523": "letters",
    "\U0001F50C": "plug", "\U0001F50B": "battery", "\U0001F9F2": "battery", "\U0001F9F9": "wrench",
    "\U0001F52B": "sword", "\U0001FA83": "sword", "\U0001FA84": "sword", "\U0001F3F9": "arrowR",
    "\U0001FA9C": "ladder", "\U0001FA9B": "ladder", "\U0001F6D7": "elevator",
    "\U0001F4A3": "bomb", "\U0001F5FC": "tower", "\U0001F93F": "diver",
    "\U0001F6D2": "cart", "\U0001F941": "drum", "\U0001F3C4": "surf",
    "\U0001F3C4\u200D\u2640": "surf", "\U0001F3C4\u200D\u2642": "surf",
    "\U0001F9D1\u200D\U0001F33E": "person", "\U0001F9D1\u200D\U0001F680": "suit",
    "\U0001F468\u200D\U0001F33E": "person", "\U0001F469\u200D\U0001F33E": "person",
    "\u23F1": "gauge", "\u23F0": "gauge", "\u23F3": "gauge", "\u231B": "gauge", "\u231A": "gauge",
    "\u23EE": "arrowL", "\u23ED": "arrowR", "\u23F4": "arrowL", "\u23F5": "arrowR",
    "\U0001F9A0": "dotOn", "\U0001F4A5": "burst", "\U0001F4A4": "sleep", "\U0001F634": "sleep",
    "\U0001F441": "eye", "\U0001F440": "eye", "\U0001F441\u200D\U0001F5E8": "eye",
    "\U0001F573": "hole", "\U0001F9F2": "battery", "\U0001F6C1": "bucket",
    "\U0001F6BF": "bucket", "\U0001F9FC": "bucket", "\U0001F6B0": "bucket",
    "\U0001F6CF": "bed", "\U0001FA91": "bed", "\U0001F6CC": "bed", "\U0001F3E9": "bed",
    "\U0001F5FD": "tower", "\U0001F3F0": "castle", "\U0001F3EF": "building",
    "\U0001F3E2": "building", "\U0001F3D7": "building", "\U0001F3D9": "building",
    "\U0001F3EA": "building", "\U0001F3EB": "building", "\U0001F3E3": "building",
    "\U0001F3E5": "building", "\U0001F3E6": "building", "\U0001F3E8": "building",
    "\U0001F3ED": "factory", "\u26EA": "building", "\U0001F54C": "building",
    "\U0001F54D": "building", "\U0001F3E0": "house", "\U0001F3E1": "house",
    "\U0001F3DA": "house", "\U0001F3D8": "house", "\U0001F3DA\uFE0F": "house",
    "\u26FA": "tent", "\U0001F6D6": "cabin", "\U0001F3D5": "tent", "\u26FD": "barrel",
    "\U0001F37D": "pot", "\U0001F963": "pot", "\U0001F9C2": "pot", "\U0001F9C6": "pot",
    "\U0001F96F": "bread", "\U0001F35E": "bread", "\U0001F956": "bread", "\U0001F950": "bread",
    "\U0001F354": "burger", "\U0001F35F": "bread", "\U0001F953": "bread", "\U0001F357": "bread",
    "\U0001F356": "bread", "\U0001F969": "bread", "\U0001F958": "bread",
    "\U0001F36B": "candy", "\U0001F36C": "candy", "\U0001F36D": "candy", "\U0001F370": "candy",
    "\U0001F9C1": "candy", "\U0001F967": "candy", "\U0001F36E": "candy", "\U0001F36F": "candy",
    "\U0001F36A": "candy", "\U0001F95A": "egg",
    "\U0001F34E": "fruit", "\U0001F34F": "fruit", "\U0001F34B": "fruit", "\U0001F34A": "fruit",
    "\U0001F349": "fruit", "\U0001F347": "fruit", "\U0001F352": "fruit", "\U0001F351": "fruit",
    "\U0001F35D": "bread", "\U0001F363": "bread", "\U0001F372": "pot", "\U0001F373": "egg",
    "\U0001F955": "fruit", "\U0001F336": "fruit", "\U0001F952": "fruit", "\U0001F966": "fruit",
    "\U0001F9C5": "fruit", "\U0001F951": "fruit", "\U0001F95D": "fruit", "\U0001FAD0": "fruit",
    "\U0001F95C": "fruit", "\U0001F9C4": "fruit",
    "\U0001F4E5": "box", "\U0001F4E9": "mailbox", "\U0001F4EB": "mailbox", "\U0001F4EC": "mailbox",
    "\U0001F4EE": "mailbox", "\U0001F4EA": "mailbox", "\U0001F4E8": "mailbox",
    "\U0001F4E7": "mailbox", "\U0001F4EE": "mailbox", "\U0001F4EF": "speaker",
    "\U0001F4DE": "gauge", "\U0001F4F1": "gauge", "\U0001F4F2": "gauge", "\U0001F4E0": "gauge",
    "\U0001F4FB": "gauge", "\U0001F4FA": "gauge", "\U0001F4E1": "satellite", "\U0001F6DF": "satellite",
    "\U0001F393": "book",
    "\U0001F455": "suit", "\U0001F457": "suit", "\U0001F45E": "suit", "\U0001F45F": "suit",
    "\U0001F460": "suit", "\U0001F462": "suit", "\U0001F45A": "suit", "\U0001F488": "suit",
    "\U0001F487": "suit", "\U0001F937": "person", "\U0001F645": "person", "\U0001F646": "person",
    "\U0001F481": "raise", "\U0001F6B6": "walk", "\U0001F574": "suit",
    "\U0001F9F8": "teddy", "\U0001F388": "candy", "\U0001F386": "burst", "\U0001F38A": "burst",
    "\U0001F9E8": "candy", "\U0001F389": "burst", "\U0001F37E": "candy",
    "\U0001F52E": "gem", "\U0001FA84": "sword", "\U0001F9FF": "spark", "\u2728": "spark",
    "\U0001F4AB": "spark", "\U0001F4A2": "siren", "\U0001F300": "tornado",
    "\U0001F302": "umbrella", "\U0001F327": "drop", "\U0001F4A7": "drop",
    "\U0001F9F8": "teddy", "\U0001F3AE": "tv", "\U0001F579": "tv", "\U0001F3B9": "letters",
    "\U0001F3B8": "letters", "\U0001F3BB": "letters", "\U0001F3BA": "speaker",
    "\U0001F3AD": "detective", "\U0001F3A8": "suit", "\U0001F3AF": "target",
    "\U0001F3E0": "house",
}

def load_icon_names():
    src = open(os.path.join(ROOT, "assets/js/shell.js"), encoding="utf8").read()
    block = src.split("const ICONS = {")[1].split("\n};")[0]
    names = set(re.findall(r"^(\w+)\(x,s\)\{", block, re.M))
    alias = src.split("const ALIAS = {")[1].split("};")[0]
    names |= set(re.findall(r"(\w+):\"", alias))
    return names

ICON = { canon(k): v for k, v in ICON.items() }
GLYPH = { canon(k): v for k, v in GLYPH.items() }
ICON_NAMES = load_icon_names()

def tidy(s):
    s = re.sub(r"\s{2,}", " ", s)
    s = re.sub(r"\s+([!?,.;:%)\]])", r"\1", s)
    s = re.sub(r"\(\s+\)", "()", s)
    s = re.sub(r"([!?,.;:])\1+", r"\1", s)
    return s.strip()

LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"")
FNTXT = re.compile(r"\b(fillText|strokeText|measureText)\([^;]*(?:\?[^;]*)?$")

def map_cluster(raw, in_text, solo, canvas_emoji, stats):
    if KEEP_CL.match(raw):
        return raw
    key = canon(raw)
    name = ICON.get(key)
    name = name if (name and name in ICON_NAMES) else None
    if in_text and solo and name:
        stats[("icon->" + name, key)] += 1
        return "i:" + name
    if name and in_text and not solo:
        stats[("glyph-in-canvas", key)] += 1
        return GLYPH.get(key, "")
    if key in canvas_emoji and name:
        stats[("icon->" + name, key)] += 1
        return "i:" + name
    g = GLYPH.get(key)
    stats[("glyph->" + repr(g) if g else "removed", key)] += 1
    return g or ""

def process_line(line, stats):
    if not EMOJI_CLUSTER.search(line):
        return line
    # pré-passada: emoji usados como sprite nesta linha (para política de solo)
    canvas_emoji = set()
    for m in LIT.finditer(line):
        content = m.group(1) if m.group(1) is not None else m.group(2)
        pre = line[max(0, m.start() - 40):m.start()]
        if FNTXT.search(pre):
            for c in EMOJI_CLUSTER.findall(content):
                if not KEEP_CL.match(c):
                    canvas_emoji.add(canon(c))
    def lit_sub(m):
        content = m.group(1) if m.group(1) is not None else m.group(2)
        quote = "'" if m.group(1) is not None else '"'
        if not EMOJI_CLUSTER.search(content):
            return m.group(0)
        pre = line[max(0, m.start() - 40):m.start()]
        in_text = bool(FNTXT.search(pre))
        stripped = EMOJI_CLUSTER.sub("", content).strip()
        solo = stripped == "" and bool(EMOJI_CLUSTER.search(content))
        def sub(mm):
            return map_cluster(mm.group(0), in_text, solo, canvas_emoji, stats)
        started_with_emoji = bool(re.match(r"\s*" + EMOJI_CLUSTER.pattern, content)) and not KEEP_CL.match(EMOJI_CLUSTER.match(content.lstrip()).group(0))
        new = EMOJI_CLUSTER.sub(sub, content)
        new = new.replace("\ufe0f", "").replace("\u200d", "")
        new = re.sub(r"\s{2,}", " ", new)
        if started_with_emoji and not solo:
            new = new.lstrip()
        if solo:
            new = tidy(new)
        return quote + new + quote
    out = LIT.sub(lit_sub, line)
    # fora de literais (ex.: comentários, concatenações soltas): remove emoji puro
    def bare_sub(m):
        return "" if not KEEP_CL.match(m.group(0)) else m.group(0)
    # remove apenas nas posições fora de strings: aproximação — linhas de comentário
    if out.lstrip().startswith("//") or out.lstrip().startswith("/*") or out.lstrip().startswith("*"):
        out = EMOJI_CLUSTER.sub(bare_sub, out).rstrip()
    return out

def tidy_js(src):
    src = re.sub(r"''\+\(", "(", src)
    src = re.sub(r"\)\+''", ")", src)
    return src

def inject_shell_map():
    m = {}
    for key, name in sorted(ICON.items()):
        if name in ICON_NAMES:
            m[key] = name
    items = ", ".join('"%s":"%s"' % (k, v) for k, v in sorted(m.items()))
    path = os.path.join(ROOT, "assets/js/shell.js")
    src = open(path, encoding="utf8").read()
    if "/*__EMOJI_MAP__*/" in src:
        src = src.replace("/*__EMOJI_MAP__*/", items)
    else:
        src = re.sub(r"const EMO_ICON = \{.*?\};", "const EMO_ICON = {" + items + "};", src, flags=re.S)
    open(path, "w", encoding="utf8").write(src)
    return len(m)

def main():
    dry = "--dry" in sys.argv
    stats = collections.Counter()
    n_files = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "games", "*.js"))):
        src = open(f, encoding="utf8").read()
        if not EMOJI_CLUSTER.search(src):
            continue
        out = "\n".join(process_line(ln, stats) for ln in src.split("\n"))
        out = tidy_js(out)
        if not dry:
            open(f, "w", encoding="utf8").write(out)
        n_files += 1
    n = inject_shell_map()
    print("arquivos transformados:", n_files)
    print("emoji mapeados no runtime:", n)
    for k, v in stats.most_common(50):
        print("%5d  %s" % (v, k))

if __name__ == "__main__":
    main()
