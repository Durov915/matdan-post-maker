document.fonts.load("1rem Roboto");

let $bannerImg, $imgPreview, $imgDownload, $imgPreviewContainer, $imgPreviewContainerDownload, actbtn, first_form, context, downloadable, imageInput;
let cropme, hRatio, vRatio;
let cropperInclude = true;
let base_image = new Image();

function addClassBasedOnScreenSize() {
    const body = document.querySelector("#first_class");
    if (window.innerWidth < 768) {
        body.classList.add("min-h-svh");
    } else {
        body.classList.remove("min-h-svh");
    }
}

function initialize() {
    $bannerImg = document.querySelector("#banner-img");
    $imgPreview = document.querySelector("#preview-canvas");
    $imgDownload = document.querySelector("#preview-canvas-download");
    $imgPreviewContainer = document.querySelector("#preview-canvas-container");
    $imgPreviewContainerDownload = document.querySelector("#preview-canvas-container-download");
    actbtn = document.querySelector("#btn-action-group");
    first_form = document.querySelector("#first_form");
    context = $imgPreview.getContext("2d");
    downloadable = $imgDownload.getContext("2d");
    imageInput = document.querySelector("#dropzone-file");
    base_image.src = "./100-matdan.png";
    base_image.onload = function () {
        $imgPreview.setAttribute("width", base_image.width);
        $imgPreview.setAttribute("height", base_image.height);
        hRatio = $imgPreview.width / base_image.width;
        vRatio = $imgPreview.height / base_image.height;
        ratio = Math.min(hRatio, vRatio);
    };
    if (cropperInclude) {
        initializeCropme(153, 153);
    }
    setupFormListener();
    addClassBasedOnScreenSize();
}

function toggleBorder(isError) {
    const imgInputContainer = document.querySelector("#dropzone-file-container");
    imgInputContainer.classList.remove(isError ? "border-gray-300" : "border-red-500");
    imgInputContainer.classList.add(isError ? "border-red-500" : "border-gray-300");
}

function initializeCropme(Width, Height) {
    const containerAspectRatio = Width / Height;
    const cropmeConfig = {
        container: {
            width: 290,
            height: 150,
        },
        viewport: {
            width: containerAspectRatio >= 1 ? 115 : 115 * containerAspectRatio,
            height: containerAspectRatio < 1 ? 115 : 115 / containerAspectRatio,
            type: "circle",
            border: {
                width: 3,
                enable: true,
                color: "red",
            },
        },
        zoom: {
            enable: true,
            mouseWheel: true,
            slider: true,
            position: "right",
        },
        rotation: {
            slider: false,
            enable: false,
        },
        transformOrigin: "viewport",
    };
    const element = document.querySelector("#container");
    cropme = new Cropme(element, cropmeConfig);
    cropme.bind({ url: "user.jpg" });
}


function calcRatio(value) {
    return (value * base_image.width) / 500;
}

function drawText(Text, x, y, fontSize, fontFamily, fontColor, textAlign, weight) {
    const size = calcRatio(fontSize);
    context.textBaseline = "hanging";
    context.font = `${weight} ${size}px '${fontFamily}'`;
    context.fillStyle = fontColor;
    context.textAlign = textAlign;
    context.fillText(Text, calcRatio(x) + size / 10, calcRatio(y) + size / 10);
}

async function drawCroppedImage(output, base_image) {
    return new Promise((resolve) => {
        const append_image = new Image();
        append_image.src = output;
        append_image.onload = function () {
            const newWidth = calcRatio(10); // Adjust these values to change the size of the image
            const newHeight = calcRatio(10); // Adjust these values to change the size of the image
            context.drawImage(append_image, calcRatio(323), calcRatio(319)); // change this values to change to hange position of image.
            resolve();
        };
    });
}




function toggleElementVisibility() {
    [$imgPreviewContainer, $bannerImg, first_form, actbtn].forEach((el) => el.classList.toggle("hidden"));
    window.scrollTo(0, 0);
}

function handleBack() {
    toggleElementVisibility();
    context.clearRect(0, 0, $imgPreview.width, $imgPreview.height);
}

function downloadCanvas() {
    const link = document.createElement("a");
    link.download = (document.querySelector('input[type="text"]').value || "post maker") + ".jpeg";
    link.href = $imgDownload.toDataURL("image/jpeg");
    link.click();
}

function shareCanvas() {
    $imgDownload.toBlob(async (blob) => {
        const file = new File([blob], (document.querySelector('input[type="text"]').value || "post maker") + ".jpeg", { type: blob.type });
        await navigator.share({ files: [file] });
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            cropme.bind({ url: e.target.result });
            toggleBorder(false);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function drawOnBaseImage(output) {
    context.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, base_image.width * ratio, base_image.height * ratio);
    if (cropperInclude) {
        await drawCroppedImage(output, base_image);
    }
    drawText(document.querySelector('#text1').value, 395, 470, 25, 'monospace', 'black', 'center', ''); // Change the coordinates here for text
    const download_image = new Image();
    download_image.src = $imgPreview.toDataURL("image/jpeg");
    download_image.onload = function () {
        $imgDownload.setAttribute("width", download_image.width);
        $imgDownload.setAttribute("height", download_image.height);
        downloadable.drawImage(download_image, 0, 0);
    };
    toggleElementVisibility();
}




// for create shape
// function drawTextBackground(x, y, width, height, color) {
//     context.fillStyle = color;
//     context.fillRect(x, y, width, height);
// }

// async function drawOnBaseImage(output) {
//     context.drawImage(base_image, 0, 0, base_image.width, base_image.height, 0, 0, base_image.width * ratio, base_image.height * ratio);
//     if (cropperInclude) {
//         await drawCroppedImage(output, base_image);
//     }

//     // Coordinates and dimensions for the text background
//     const textX = 192; // X-coordinate for the text
//     const textY = 444; // Y-coordinate for the text
//     const textWidth = 200; // Width of the background rectangle
//     const textHeight = 50; // Height of the background rectangle
//     const backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Background color (semi-transparent red)

//     // Clear the old background area
//     context.clearRect(textX - textWidth / 2, textY - textHeight / 2, textWidth, textHeight);

//     // Draw the new text background
//     drawTextBackground(textX - textWidth / 2, textY - textHeight / 2, textWidth, textHeight, backgroundColor);

//     // Draw the text on top of the background
//     drawText(document.querySelector('#text1').value, textX, textY, 18, 'Roboto', '#fffbef', 'center', '');

//     const download_image = new Image();
//     download_image.src = $imgPreview.toDataURL("image/jpeg");
//     download_image.onload = function () {
//         $imgDownload.setAttribute("width", download_image.width);
//         $imgDownload.setAttribute("height", download_image.height);
//         downloadable.drawImage(download_image, 0, 0);
//     };
//     toggleElementVisibility();
// }


function setupFormListener() {
    first_form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (cropperInclude) {
            const imageBlank = imageInput.value === "";
            toggleBorder(imageBlank);
            if (!imageBlank) {
                cropme.crop({ width: calcRatio(153) }).then(async (output) => {
                    await drawOnBaseImage(output);
                });
                sendAnalytics();
            }
        } else {
            await drawOnBaseImage(null);
            sendAnalytics();
        }
    });
}

window.addEventListener("load", initialize);
window.addEventListener("resize", addClassBasedOnScreenSize);
