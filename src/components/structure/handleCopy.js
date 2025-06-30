export const handleCopy = (event, text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        const tag = event.currentTarget;
        if (tag.tagName === 'BUTTON') {
            if (tag.innerHTML === "Copy") {
                tag.innerHTML = 'Copied'
            } else {
                tag.innerHTML = `
                <img src="/copied.svg" class='me-2'/>
                Copied
                `;
            }

            setTimeout(() => {
                if (tag.innerHTML === "Copied") {
                    tag.innerHTML = 'Copy'
                } else {
                    tag.innerHTML = `
                    <img src="/copy_blue.svg" className='me-2' />
                    Copy
                    `;
                }
            }, 3000)
        } else if (tag.tagName === 'IMG') {
            tag.src = "/copied.svg";
            setTimeout(() => {
                tag.src = "/copy.svg";
            }, 3000);
        }

    } catch (err) {
        console.error('Failed to copy text:', err);
    } finally {
        document.body.removeChild(textArea);
    }
};