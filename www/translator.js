function translateColorName(colorName) {
    if (!colorName) return '-';

    // 1. புள்ளிகள் (..), கமா, கூடுதல் ஸ்பேஸ்களை நீக்குகிறது
    var cleanName = String(colorName).replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanName) return '-';
    var c = cleanName.toLowerCase();

    // 2. அடிப்படை நிறங்கள் (Base colours)
    var base = {
        // Basic
        'red': 'ரெட்', 'blue': 'புளு', 'green': 'கிரீன்', 'yellow': 'மஞ்சள்',
        'white': 'வெள்ளை', 'salavai': 'சலவை', 'black': 'கருப்பு',
        'grey': 'கிரே', 'gray': 'கிரே', 'brown': 'பிரவுன்',
        'orange': 'ஆரஞ்சு', 'pink': 'பிங்க்', 'rose': 'ரோஸ்',
        'violet': 'வைலட்', 'purple': 'பர்புள்', 'navy': 'நேவி',
        'cream': 'கிரீம்', 'khaki': 'காக்கி', 'maroon': 'மெரூன்',
        'olive': 'ஆலிவ்', 'beige': 'பேஜ்', 'silver': 'சில்வர்',
        'peach': 'பீச்', 'mint': 'மிண்ட்', 'gold': 'கோல்டு',
        'golden': 'கோல்டன்', 'mustard': 'மஸ்டர்ட்', 'wine': 'ஒயின்',
        'turquoise': 'டர்க்', 'teal': 'டீல்', 'rust': 'ரஸ்ட்',
        'magenta': 'மெஜந்தா', 'lavender': 'லாவெண்டர்', 'pista': 'பிஸ்தா',
        'onion': 'ஆனியன்',

        // Extra colours
        'sky': 'ஸ்கை', 'skyblue': 'ஸ்கை புளு', 'royal': 'ராயல்',
        'coffee': 'காபி', 'chocolate': 'சாக்லேட்', 'choco': 'சாக்கோ',
        'tan': 'டான்', 'camel': 'கேமல்', 'lemon': 'லெமன்',
        'parrot': 'பேரட்', 'bottle': 'பாட்டில்', 'leaf': 'லீஃப்',
        'apple': 'ஆப்பிள்', 'grass': 'கிராஸ்', 'sea': 'சீ',
        'firozi': 'பிரோசி', 'ferozi': 'பிரோசி', 'feroza': 'பிரோசா',
        'aqua': 'அக்வா', 'cyan': 'சியான்', 'indigo': 'இண்டிகோ',
        'coral': 'கோரல்', 'salmon': 'சால்மன்', 'ivory': 'ஐவரி',
        'offwhite': 'ஆஃப் வைட்', 'charcoal': 'சார்கோல்', 'ash': 'ஆஷ்',
        'steel': 'ஸ்டீல்', 'bronze': 'பிரான்ஸ்', 'copper': 'காப்பர்',
        'brick': 'பிரிக்', 'blood': 'பிளட்', 'cherry': 'செர்ரி',
        'crimson': 'கிரிம்சன்', 'scarlet': 'ஸ்கார்லெட்', 'plum': 'பிளம்',
        'lilac': 'லைலாக்', 'mauve': 'மாவ்', 'orchid': 'ஆர்க்கிட்',
        'fuchsia': 'ஃபுக்சியா', 'baby': 'பேபி', 'hot': 'ஹாட்',
        'neon': 'நியான்', 'fluorescent': 'ஃப்ளோரசென்ட்', 'lime': 'லைம்',
        'emerald': 'எமரால்டு', 'jade': 'ஜேட்', 'sage': 'சேஜ்',
        'moss': 'மாஸ்', 'army': 'ஆர்மி', 'forest': 'பாரஸ்ட்',
        'mehndi': 'மெஹந்தி', 'mehandi': 'மெஹந்தி', 'rani': 'ராணி',
        'sandal': 'சாண்டல்', 'sand': 'சாண்ட்', 'skin': 'ஸ்கின்',
        'nude': 'நியூட்', 'wheat': 'வீட்', 'biscuit': 'பிஸ்கட்',
        'oat': 'ஓட்', 'oatmeal': 'ஓட்மீல்', 'egg': 'எக்', 'ecru': 'எக்ரூ',
        'jet': 'ஜெட்', 'multi': 'மல்டி', 'mix': 'மிக்ஸ்', 'dark': 'டார்க்',
        'light': 'லைட்', 'medium': 'மீடியம்', 'pale': 'பேல்',
        'bright': 'பிரைட்', 'deep': 'டீப்', 'dull': 'டல்',
        'kum': 'குங்குமம்', 'kungumam': 'குங்குமம்', 'ganga': 'கங்கா',
        'yamuna': 'யமுனா', 'peacock': 'பீகாக்', 'rama': 'ராமா',
        'radha': 'ராதா', 'mango': 'மேங்கோ', 'banana': 'பனானா',
        'grape': 'கிரேப்', 'strawberry': 'ஸ்ட்ராபெர்ரி', 'cocoa': 'கோகோ',
        'mocha': 'மோக்கா', 'rani pink': 'ராணி பிங்க்', 'gulabi': 'குலாபி',
        'kesari': 'கேசரி', 'kavi': 'காவி', 'saffron': 'சாஃப்ரான்',
        'blueberry': 'புளூபெர்ரி', 'denim': 'டெனிம்', 'ink': 'இங்க்',
        'midnight': 'மிட்நைட்', 'cobalt': 'கோபால்ட்', 'slate': 'ஸ்லேட்',
        'pearl': 'பேர்ல்', 'snow': 'ஸ்நோ', 'milk': 'மில்க்',
        'lemonyellow': 'லெமன் யெல்லோ', 'sunflower': 'சன்பிளவர்',
        'rosewood': 'ரோஸ்வுட்', 'rosepink': 'ரோஸ் பிங்க்',
        'wood': 'வுட்', 'tea': 'டீ', 'dust': 'டஸ்ட்', 'smoke': 'ஸ்மோக்',
        'stone': 'ஸ்டோன்', 'mud': 'மட்', 'clay': 'கிளே',
        'terracotta': 'டெரகோட்டா', 'pumpkin': 'பம்ப்கின்',
        'carrot': 'கேரட்', 'tomato': 'டொமேட்டோ', 'chilli': 'சில்லி',
        'chili': 'சில்லி', 'cardinal': 'கார்டினல்', 'ruby': 'ரூபி'
    };

    // 3. முன்னொட்டுகள் (Prefixes) → L. D. R. T. M.
    var prefix = {
        'l': 'L.', 'lt': 'L.', 'lite': 'L.', 'light': 'L.',
        'd': 'D.', 'dk': 'D.', 'dark': 'D.',
        'r': 'R.', 'royal': 'R.',
        't': 'T.',
        'm': 'M.', 'med': 'M.', 'medium': 'M.',
        'p': 'P.', 'pale': 'P.',
        'b': 'B.', 'bright': 'B.',
        's': 'S.', 'sky': 'S.',
        '1/2': '1/2', 'half': '1/2'
    };

    // 4. முழு பெயர் மேப்பிங் (special / exception cases)
    var full = {
        'r blue': 'R. புளு', 'royal blue': 'R. புளு',
        's blue': 'S. புளு', 'sky blue': 'S. புளு', 'skyblue': 'S. புளு',
        'bottle green': 'பாட்டில் கிரீன்', 'b green': 'பாட்டில் கிரீன்',
        'parrot green': 'P. கிரீன்', 'p green': 'P. கிரீன்',
        'rani pink': 'ராணி பிங்க்', 'rama green': 'ராமா கிரீன்',
        '1/2 salavai': '1/2 சலவை', '1/2 white': '1/2 சலவை',
        't salavai': 'T. சலவை', 't white': 'T. சலவை',
        'off white': 'ஆஃப் வைட்', 'jet black': 'ஜெட் பிளாக்',
        'lemon yellow': 'லெமன் யெல்லோ',
        'coffee brown': 'காபி பிரவுன்', 'choco brown': 'சாக்கோ பிரவுன்'
    };

    if (full[c]) return full[c];
    if (base[c] && !prefix[c]) return base[c];

    // 5. வார்த்தை வார்த்தையாக மாற்றுதல்
    var words = c.split(' ');
    var out = [];
    for (var i = 0; i < words.length; i++) {
        var w = words[i];
        var isLast = (i === words.length - 1);

        if (!isLast && prefix[w]) {
            out.push(prefix[w]);
        } else if (base[w]) {
            out.push(base[w]);
        } else if (prefix[w]) {
            out.push(prefix[w]);
        } else if (/^\d+$/.test(w) || /^\d+\/\d+$/.test(w)) {
            out.push(w);
        } else {
            // தெரியாத வார்த்தை – அப்படியே (முதல் எழுத்து பெரிதாக)
            out.push(w.charAt(0).toUpperCase() + w.slice(1));
        }
    }

    return out.join(' ');
}
