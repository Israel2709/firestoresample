// Create a root reference
var storageRef = firebase.storage().ref();

/*creamos una variable para guardar el archivo*/
let file;

/*agregamos un listener a nuestro input para extraer el archivo*/
$("#file-sample").on("change", event => {
    let fileInput = event.target
    console.log(fileInput.files)

    /*guardamos el archivo en la variable creada previamente*/
    file = fileInput.files[0]
})



//$("#upload-file").click(uploadFile)

var database = firebase.database()
var productsRef = database.ref('/products')

productsRef.on('value', snapshot => {
    console.log( snapshot )
    console.log( snapshot.val() )
    let productsList = snapshot.val()

    $("#products-wrapper").empty( )
    for( product in productsList ){
        console.log( product )
        console.log( productsList[product] )
        //console.log( productsList["producto 1"] )
        printCards( product, productsList[product] )
    }
})

const printCards = ( productId, productData ) => {
    let { name, description, price, imgSrc } = productData

    let cardHtml = `
        <div class="col-12 col-md-4 mb-3">
            <div class="card">
                <img src="${ imgSrc }" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${ name }</h5>
                <p class="card-text">${ description }</p>
                <p class="card-text">${ price }</p>
                <div class="d-flex">
                    <button 
                        class="btn btn-danger mr-2" 
                        data-product-id=${ productId }
                        onclick="deleteProduct(event)"
                    >Borrar Producto</button>
                    <button 
                        class="btn btn-secondary ml-2" 
                        data-product-id=${ productId }
                        onclick="updateProduct(event)"
                    >Editar Producto</button>
                </div>
                
                </div>
            </div>
        </div>
    `
    $("#products-wrapper").append( cardHtml )
}

const uploadFile = () => {
    console.log(file)

    /*creamos una referencia dentro de la carpeta "images", con el nombre del archivo que vamos a subir, y usamos el método put para subirlo */
    var uploadTask = storageRef.child(`images/${file.name}.jpg`).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        $("#progress-bar").css({ "width": `${progress}%` }).text(`${progress}%`)

        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) { /*callback en caso de error */
        console.log(error)
    }, function () { /*callback en caso de éxito*/
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            productObject.imgSrc = downloadURL
        });
    });
}

const saveProduct = () => {
    let productObject = {}
    var uploadTask = storageRef.child(`images/${file.name}.jpg`).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        $("#progress-bar").css({ "width": `${progress}%` }).text(`${progress}%`)

        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
        }
    }, function (error) { /*callback en caso de error */
        console.log(error)
    }, function () { /*callback en caso de éxito*/
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            productObject.imgSrc = downloadURL
            console.log( productObject )

            $("#product-form input[type='text']").each( function( index ){
                console.log( $(this) )
                let value = $(this).val()
                let property = $(this).attr("name")
                productObject = { ...productObject, [property]:value }
            })
            console.log( productObject )
            productsRef.push( productObject )
        });
    });
}

const deleteProduct = event => {
    console.log( event )
    let productId = $( event.target ).data("product-id")
    console.log( productId)
    database.ref(`/products/${productId}`).remove()
}

const updateProduct = event => {
    console.log( event )
    let productId = $( event.target ).data("product-id")
    console.log( productId)
    let newData = { name: "updated name "}
    database.ref(`/products/${productId}`).set(newData)
}
