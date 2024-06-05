document.addEventListener('DOMContentLoaded', () => {
    const resultNode = document.getElementById('result');

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#interactive')
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader"] // JANコード（EAN-13およびEAN-8）を指定
        }
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    Quagga.onDetected(data => {
        const code = data.codeResult.code;
        resultNode.innerHTML = `<p>バーコードが検出されました: ${code}</p>`;
        fetchProductInfo(code);
        Quagga.stop();
    });
});

function fetchProductInfo(barcode) {
    const apiEndpoint = `https://api.example.com/products/${barcode}`;  // 実際のAPIエンドポイントに置き換えてください

    axios.get(apiEndpoint)
        .then(response => {
            const productInfo = response.data;
            displayProductInfo(productInfo);
        })
        .catch(error => {
            console.error('商品情報の取得エラー:', error);
            document.getElementById('result').innerHTML += '<p>商品情報が見つかりません。</p>';
        });
}

function displayProductInfo(productInfo) {
    const resultNode = document.getElementById('result');
    resultNode.innerHTML += `
        <h2>${productInfo.name}</h2>
        <p>価格: ${productInfo.price}</p>
        <p>説明: ${productInfo.description}</p>
    `;
}
