const username = localStorage.getItem('khiladi_local');
if (!username) {
    alert('Please Login First!');
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxL5CAFml1Dp5-VjpWfrbqT4np3YcemzgFf6a0T-ulYndt2GV2eVeCnd6R30Pop_yA9/exec';

function showQR() {
    const amount = document.getElementById('amount').value;
    if (!amount) {
        alert('Please enter amount');
        return;
    }

    const upiId = '9896199732@ptyes';
    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;

    const qr = qrcode(0, 'M');
    qr.addData(upiLink);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag(5);

    document.getElementById('amountPage').style.display = 'none';
    document.getElementById('qrPage').style.display = 'flex';
}

function showUpload() {
    document.getElementById('qrPage').style.display = 'none';
    document.getElementById('uploadPage').style.display = 'flex';
}

function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        preview.src = reader.result;
        preview.style.display = 'block';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 6b0a5c430aad13d'
        },
        body: formData
    });

    const data = await response.json();
    return data.data.link;
}

async function submitForm() {
    const amount = document.getElementById('amount').value;
    const screenshot = document.getElementById('screenshot').files[0];

    if (!screenshot) {
        alert('Please upload a screenshot');
        return;
    }

    try {
        const imgurLink = await uploadToImgur(screenshot);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('amount', amount);
        formData.append('imageUrl', imgurLink);
        formData.append('sheet', 'add_money');

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.text();

        if (result.includes('success')) {
            alert('Payment details submitted successfully!');
            document.getElementById('amount').value = '';
            document.getElementById('screenshot').value = '';
            document.getElementById('preview').style.display = 'none';
            document.getElementById('uploadPage').style.display = 'none';
            document.getElementById('amountPage').style.display = 'block';
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        alert('Error submitting form: ' + error.message);
        console.error(error);
    }
}
