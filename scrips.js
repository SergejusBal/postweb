var url = "http://localhost:8080";
var offset = 0;

document.getElementById("createPost").addEventListener("click", async function(event) {

    if(!getCookie("paymentCode")) {
        document.getElementById("response").innerHTML = "Payment needed";
        return;
    }

    let post = fillPostData();
    if(post){
        await createPost(post);    
        clearPostData();
    }   

});

document.getElementById("showPosts").addEventListener("click", async function(event) {

    let posts = await getPosts(offset,10);
    if(posts){
        await displayPosts(posts);
    }

});

async function createPost(post) {     

    try{   
        let response = await fetch(url + '/posts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', 
                'PaymentCode':  getCookie("paymentCode") + "",
                'PaymentID':  getCookie("paymentID"),            
            },
            body: JSON.stringify({
            "name":post.name,           
            "content":post.content,
            "contacts":post.contacts          
            }),        
        })

        if (response.status == 500){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }

        if (response.status == 402){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }        

        if (response.status == 400){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }
        if (response.status == 200) {
            document.getElementById("response").innerHTML = await response.text();
            return;
        }  

    }    
    catch(error){
        console.error('Error:', error);
    }    
    
}

async function getPosts(offset, limit) {     

    try{
        let response = await fetch(url + '/posts'+"?offset=" + offset +  "&limit=" + limit, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',               
            },                    
        })        

        if (response.status == 204){ 
            document.getElementById("response").innerHTML = "No data";       
           return;
        }
        else if (response.status == 200) {
            return await response.json();
        } 

    
    } catch (error) {
        console.error('Error:', error);
    }   
    
}


function displayPosts(posts) {    
    const post_container = document.getElementById("postsContainer");
    
    posts.forEach(posts => {
      
        const newPost = document.createElement("div");
        newPost.className = "post";        

        const postHeader = document.createElement("div");
        postHeader.className = "post-header";

        const id_span = document.createElement("span");
        id_span.className = "post-id";
        id_span.textContent = "ID: " + posts.id;
        const name_spam = document.createElement("span");
        name_spam.className = "post-name";
        name_spam.textContent = "Posted by: " + posts.name; 
        postHeader.appendChild(name_spam);
        postHeader.appendChild(id_span);     


        const postBody = document.createElement("div");
        postBody.className = "post-content";
        postBody.textContent = posts.content;


        const postFotter = document.createElement("div");
        postFotter.className = "post-footer";

        const id_phone = document.createElement("span");
        id_phone.className = "post-phone";
        id_phone.textContent = "Phone: " + posts.contacts.substring(0, 4) + " " + posts.contacts.substring(4, 5) + " " + posts.contacts.substring(5, 8) + " " + posts.contacts.substring(8, 12);
        const date_spam = document.createElement("span");
        date_spam.className = "post-date";      
        let formattedDate = posts.data_created.replace('T', ' ');
        date_spam.textContent = "Date: " + formattedDate;
        postFotter.appendChild(id_phone);
        postFotter.appendChild(date_spam); 
        

        newPost.appendChild(postHeader);
        newPost.appendChild(postBody); 
        newPost.appendChild(postFotter); 

        post_container.appendChild(newPost);

        console.log(offset);
        offset++;
    });
}


function fillPostData(){
    var post = {};   

    if(document.getElementById("name").value.length < 50){
        post.name = document.getElementById("name").value;
    }
    else{
        document.getElementById("response").innerHTML = "Name to long";
        return false; 
    }  

    if(document.getElementById("content").value.length < 200){
        post.content = document.getElementById("content").value; 
    }
    else{
        document.getElementById("response").innerHTML = "Content to long";
        return false; 
    }  

    if(checkphone(document.getElementById("contacts").value)) {  
         post.contacts = document.getElementById("contacts").value;    
    }    
    else{
        document.getElementById("response").innerHTML = "Invalid phone format";
        return false; 
    }   
    return post;

}

function clearPostData(){
    document.getElementById("name").value = "";
    document.getElementById("content").value = "";
    document.getElementById("contacts").value = "";
}

function checkphone(phoneNumber){
    const phoneNumberPattern = /^\+370\d{8}$/;
    return phoneNumberPattern.test(phoneNumber);   
}


document.addEventListener('DOMContentLoaded',  async function() {    
    let load =0;

    while(!hasVerticalScrollBar() && load < 10){  
        let posts = await getPosts(offset,10);
        if(posts){
            await displayPosts(posts);
        } 
        load++;        
    } 

});

window.addEventListener('scroll', async function() {
        
    let hasLoaded = false;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !hasLoaded) {
        let posts = await getPosts(offset,10);
        if(posts){
            await displayPosts(posts);
        }
        hasLoaded = true;        
    }
    else if (window.innerHeight + window.scrollY + 100 < document.body.offsetHeight) {
        hasLoaded = false;
    }

});

function hasVerticalScrollBar() {
    return document.body.scrollHeight > window.innerHeight;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//######### this is directly using payment
//
// src="https://js.stripe.com/v3/">

//   document.addEventListener("DOMContentLoaded", async () => {
//     const stripe = Stripe('pk_test_your_public_key');

//     const createPaymentIntent = async () => {
//       const response = await fetch('/api/stripe/create-payment-intent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount: 2000, // Example amount in cents
//           currency: 'usd'
//         })
//       });

//       const { clientSecret } = await response.json();
//       return clientSecret;
//     };

//     const handlePayment = async () => {
//       const clientSecret = await createPaymentIntent();

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: document.querySelector('#card-element'),
//           billing_details: {
//             name: 'Jenny Rosen'
//           }
//         }
//       });

//       if (result.error) {
//         // Show error to your customer
//         console.error(result.error.message);
//       } else {
//         if (result.paymentIntent.status === 'succeeded') {
//           // The payment is complete!
//           console.log('Payment succeeded!');
//         }
//       }
//     };

//     document.querySelector('#payment-button').addEventListener('click', handlePayment);

//     const elements = stripe.elements();
//     const cardElement = elements.create('card');
//     cardElement.mount('#card-element');
//   });


document.getElementById("checkout").addEventListener("click", async () => {
    // Replace with your public key
    const stripe = Stripe('pk_test_51PlENQHWGvvl25KmMUuPtb9iFyXtRJt8Xf1ttsKjNS4ryOkdvZz2FNrwr0KCNBKTQvBiCeOER6LxNUbY8KVQklkW00fZHeGmb4');
    const response = await fetch(url+'/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({  
        amount: 2000, // Amount in cents
        currency: 'usd'
    })
    });

    const session = await response.json();    

    const sessionId = session.id;
    setCookie("paymentCode", session.paymentCode,1);
    setCookie("paymentID", session.paymentID,1);

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
    console.error("Stripe Checkout error:", error.message);
    }
});






