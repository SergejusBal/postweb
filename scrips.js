var url = "http://localhost:8080/posts";

var offset = 0;

document.getElementById("createPost").addEventListener("click", async function(event) {

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
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',               
            },
            body: JSON.stringify({
            "name":post.name,           
            "content":post.content,
            "contacts":post.contacts          
            }),        
        })
        

        if (response.status == 400){
            document.getElementById("response").innerHTML = await response.text();
            return;
        }
        else if (response.status == 200) {
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
        let response = await fetch(url+"?offset=" + offset +  "&limit=" + limit, {
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
    const tableBody = document.getElementById('postTable').getElementsByTagName('tbody')[0];
 //   tableBody.innerHTML = ''; // Clear existing clients entries

    posts.forEach(posts => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = posts.id || 'No name available';
        row.insertCell(1).textContent = posts.name || 'No name available';
        row.insertCell(2).textContent = posts.content || 'No name available';
        row.insertCell(3).textContent = posts.contacts || 'No name available';
        row.insertCell(4).textContent = posts.data_created || 'No name available';
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




window.addEventListener('scroll', async function() {
        
    let hasLoaded = false;

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !hasLoaded) {
        let posts = await getPosts(offset,10);
        if(posts){
            await displayPosts(posts);
        }
        hasLoaded = true;        
    }
    else if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
        hasLoaded = false;
    }

});




