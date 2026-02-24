let showSignature = true;
let showCTA = true;
let showFooter = true;

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    updatePreview();
    
    editor.addEventListener('input', updatePreview);
    
    // Tab support for indentation
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) document.execCommand('outdent');
            else document.execCommand('indent');
            updatePreview();
        }
    });

    const observer = new MutationObserver(updatePreview);
    observer.observe(editor, { childList: true, subtree: true, attributes: true });
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('editor').focus();
    updatePreview();
}

function handleListAction(val) {
    if (!val) return;
    if (val === 'indent' || val === 'outdent') {
        execCmd(val);
    } else if (val === 'ul') {
        execCmd('insertUnorderedList');
    } else if (val === 'ol') {
        execCmd('insertOrderedList');
    }
    // Reset selector
    document.querySelector('select[title="Lists"]').selectedIndex = 0;
    updatePreview();
}

function insertLink() {
    const url = prompt("Enter URL:", "https://");
    if (url) execCmd('createLink', url);
}

function clearEditor() {
    const editor = document.getElementById('editor');
    const confirmed = confirm("Are you sure you want to clear the message content?");
    if (confirmed) {
        editor.innerHTML = '<div><br></div>';
        updatePreview();
    }
}

function toggleSignature() {
    showSignature = !showSignature;
    document.getElementById('sigToggle').classList.toggle('active');
    document.getElementById('signatureFields').classList.toggle('hidden');
    updatePreview();
}

function toggleCTA() {
    showCTA = !showCTA;
    document.getElementById('ctaToggle').classList.toggle('active');
    document.getElementById('ctaFields').classList.toggle('hidden');
    updatePreview();
}

function toggleFooter() {
    showFooter = !showFooter;
    document.getElementById('footerToggle').classList.toggle('active');
    document.getElementById('footerFields').classList.toggle('hidden');
    updatePreview();
}

function updatePreview() {
    const editorContent = document.getElementById('editor').innerHTML;
    const data = {
        name: document.getElementById('sigName').value,
        title: document.getElementById('sigTitle').value,
        phone: document.getElementById('sigPhone').value,
        market: document.getElementById('sigMarket').value,
        email: document.getElementById('sigEmail').value,
        ctaText: document.getElementById('ctaText').value,
        ctaLink: document.getElementById('ctaLink').value,
        footerDisclaimer: document.getElementById('footerDisclaimer').value
    };

    const websiteUrl = "https://www.paramountwirelessusa.com/  ";

    let ctaHTML = '';
    if (showCTA && data.ctaLink && data.ctaText) {
        ctaHTML = `
            <tr>
                <td align="center" style="padding: 10px 40px 40px 40px;">
                    <a href="${data.ctaLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif;">
                        ${data.ctaText}
                    </a>
                </td>
            </tr>
        `;
    }

    let signatureHTML = '';
    if (showSignature) {
        signatureHTML = `
            <tr>
                <td style="padding: 0 40px;">
                    <div style="border-top: 2px solid #f1f5f9; padding-top: 15px; margin-top: 10px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="80" style="vertical-align: top; padding-right: 15px;">
                                    <img src="https://s12.gifyu.com/images/b39dH.png  " alt="Logo" width="70" style="display: block; border: none;">
                                </td>
                                <td style="vertical-align: top; line-height: 1.1; font-family: Arial, sans-serif;">
                                    <div style="font-size: 16px; font-weight: bold; color: #0f172a;">${data.name}</div>
                                    <div style="font-size: 13px; color: #ef4444; font-weight: 700;">${data.title}</div>
                                    <div style="font-size: 12px; color: #64748b;">${data.market}</div>
                                    <div style="font-size: 11px; color: #475569;">
                                        <a href="mailto:${data.email}" style="color: #475569; text-decoration: none;">${data.email}</a>
                                        <span style="margin: 0 6px; color: #cbd5e1;">|</span>
                                        <span style="font-weight: 600;">${data.phone}</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        `;
    }

    let footerHTML = '';
    if (showFooter) {
        footerHTML = `<tr><td style="padding: 40px; font-size: 10px; color: #94a3b8; text-align: center; font-family: Arial, sans-serif;">${data.footerDisclaimer}</td></tr>`;
    }

    const finalHTML = `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; background-color: #ffffff; border-collapse: collapse; font-family: Arial, sans-serif;">
            <tbody>
                <tr>
                    <td align="center" style="padding: 40px 20px 20px 20px;">
                        <img src="https://s12.gifyu.com/images/b39dH.png  " alt="Paramount Wireless" style="height: 100px; display: block; margin: 0 auto; border: none;">
                        <div style="height: 2px; width: 70%; margin: 25px auto 0 auto; background: linear-gradient(to right, rgba(239, 68, 68, 0), rgba(239, 68, 68, 1), rgba(239, 68, 68, 0));"></div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 40px; color: #1e293b; font-size: 15px; line-height: 1.6;">
                        <style>
                            .email-body ul { list-style-type: disc; margin: 10px 0 10px 25px; padding: 0; }
                            .email-body ol { list-style-type: decimal; margin: 10px 0 10px 25px; padding: 0; }
                            .email-body li { margin-bottom: 5px; }
                        </style>
                        <div class="email-body">${editorContent}</div>
                    </td>
                </tr>
                ${ctaHTML}
                ${signatureHTML}
                ${footerHTML}
            </tbody>
        </table>
    `;

    document.getElementById('email-preview').innerHTML = finalHTML;
}

function copyToClipboard() {
    const previewArea = document.getElementById('email-preview');
    const range = document.createRange();
    range.selectNode(previewArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    try {
        if (document.execCommand('copy')) {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerText;
            btn.style.backgroundColor = '#16a34a';
            btn.innerText = 'Draft Copied!';
            setTimeout(() => {
                btn.style.backgroundColor = '#0b57d0';
                btn.innerText = originalText;
            }, 2000);
        }
    } catch (err) {
        alert("Please select the preview content and copy manually.");
    }
    window.getSelection().removeAllRanges();
}
