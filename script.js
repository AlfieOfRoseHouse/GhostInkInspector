//Global Variables
        //Elements
const inputElement = document.getElementById('inputTxt');
const outputElement = document.getElementById('outputTxt');
const tooltip = document.getElementById('tooltip');
const copyOriginalButton = document.getElementById('copyOriginal');
const copyCleanButton = document.getElementById('copyClean');
        //Event Handling
inputElement.addEventListener('input', UpdateOutput);
document.addEventListener('mouseover', tooltipHandler);
document.addEventListener('mousemove', moveMouse);
document.addEventListener('mouseout', hidetooltip);
copyOriginalButton.addEventListener('click', () => copy('original'));
copyCleanButton.addEventListener('click', () => copy('clean'));
        //Tooltip Info
const charExplanations = [
        { char: "[U+200B]", name: "Zero Width Space (U+200B)", explanation: "Suggests line breaks without visible spacing. Often found in AI or bot-generated text." },
        { char: "[U+200C]", name: "Zero Width Non-Joiner (U+200C)", explanation: "Prevents characters from connecting in scripts like Arabic or Persian." },
        { char: "[U+200D]", name: "Zero Width Joiner (U+200D)", explanation: "Forces connection between characters. Used in emojis like 👩‍💻 or 👨‍👩‍👧‍👦." },
        { char: "[U+2060]", name: "Word Joiner (U+2060)", explanation: "Prevents line breaks at its position, replacing the deprecated no-break space." },
        { char: "[U+FEFF]", name: "Byte Order Mark (U+FEFF)", explanation: "Legacy marker at the start of text files; sometimes inserted invisibly in content." },
        { char: "[U+180E]", name: "Mongolian Vowel Separator (U+180E)", explanation: "Old character used in Mongolian script. Deprecated but might still show up in strange places." },
        { char: "[U+200E]", name: "Left-To-Right Mark (U+200E)", explanation: "Indicates left-to-right text direction. Often used in right-to-left languages to force alignment." },
        { char: "[U+200F]", name: "Right-To-Left Mark (U+200F)", explanation: "Indicates right-to-left text direction. Used in languages like Arabic and Hebrew." },
        { char: "[U+202A]", name: "Left-To-Right Embedding (U+202A)", explanation: "Forces left-to-right text direction, even within a right-to-left script." },
        { char: "[U+202B]", name: "Right-To-Left Embedding (U+202B)", explanation: "Forces right-to-left text direction within a left-to-right script." },
        { char: "[U+202C]", name: "Pop Directional Formatting (U+202C)", explanation: "Ends any previous directional formatting." },
        { char: "[U+202D]", name: "Left-To-Right Override (U+202D)", explanation: "Overrides text direction to left-to-right, even in a right-to-left script." },
        { char: "[U+202E]", name: "Right-To-Left Override (U+202E)", explanation: "Overrides text direction to right-to-left, even in a left-to-right script." },
        { char: "[U+2061]", name: "Invisible Times (U+2061)", explanation: "Acts as a multiplication sign without visible representation." },
        { char: "[U+2062]", name: "Invisible Plus (U+2062)", explanation: "Acts as a plus sign without visible representation." },
        { char: "[U+2063]", name: "Invisible Separator (U+2063)", explanation: "Acts as a separator between words without visible space." }
];
const explanationMap = Object.fromEntries(
        charExplanations.map(entry => [entry.char, entry])
);
        //generates Regex pattern to find 'Watermarks'
const pattern = generateRegex();

//Generates the Regex Pattern
function generateRegex() {
        //gets each pattern from tooltip table 
        const regexParts = charExplanations.map(entry => {
                //Extracts hex code of each character
                const hexCode = entry.char.match(/U\+([0-9A-F]+)/)[1];
                return `\\u${hexCode}`;
        });

        //Joins regexParts
        return new RegExp(`[${regexParts.join('')}]`, 'g');
}

//Updates highlighted area
function UpdateOutput() {
        //Highlights input text using a regex to generate output text
        const outputTxt = inputElement.value.replace(pattern, match => {
                const code = match.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
                return `<mark>[U+${code}]</mark>`;
        });
        //Displays Highlighted Text
        outputElement.innerHTML = outputTxt;
}


//Handles the tooltip - moving and changing
function tooltipHandler(e) {
        const target = e.target.closest('mark');
        if (!target) return tooltip.classList.remove('visible');

        const char = target.textContent.trim();
        const info = explanationMap[char];

        tooltip.textContent = info
                ? `${info.name}: ${info.explanation}`
                : 'Unknown hidden character';


        tooltip.classList.add('visible');
}
function moveMouse(e) {
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = e.pageY + 'px';
}
function hidetooltip(e) {
        if (!e.target.closest('mark')) {
                tooltip.classList.remove('visible');
        }
}


//Handles Clipboard Buttons
function copy(buttonType) {
        let textToCopy;

        //Sets text to either original text or clean text
        switch (buttonType) {
                case ('original'): textToCopy = inputElement.value; break;
                case ('clean'): textToCopy = inputElement.value.replace(pattern, '');
        }

        //Copies said text to the clipboard
        copyToClipboard(textToCopy);
}
function copyToClipboard(text) {
        if (navigator.clipboard) {
                //uses clipboard API if modern browser
                navigator.clipboard.writeText(text)
                        .then(() => {
                                //Alerts user - generic safety thing
                                alert('Text successfully copied to clipboard');
                        })
                        .catch(err => {
                                //If the copy failed
                                console.error('Failed to copy text:', err);
                        });
                return;
        }
        //Uses a deprecated function if old browser
        //Creates a textarea that is selected and thus can be copied
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        //Copies content of textarea using a deprecated function
        document.execCommand('copy');

        //Deletes textarea
        document.body.removeChild(textArea);

        //Alerts user - generic safety thing
        alert('Text copied to clipboard');
}