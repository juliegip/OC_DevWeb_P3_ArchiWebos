
const connect = document.querySelector("#form-id").addEventListener("submit",function(e){
    
        e.preventDefault();
        const loginDetails = {
                email: e.target.querySelector("[name=email]").value,
                password: e.target.querySelector("[name=password]").value
            };
            console.log("LoginDetails  :",loginDetails);
        
        fetch("http://localhost:5678/api/users/login", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(loginDetails)
        })
               .then(r => {
                    if (r.ok) {
                        return r.json()
                    
                    } else {
                        throw new Error ("Identifiant/Mot de passe incorrect. Veuillez saisir à nouveau");
                    }
                })
                .then(data => {
                        console.log("le token est:",data.token)
                        window.localStorage.setItem("token",data.token);
                        window.location = "index.html";
                })
                .catch(error => {
                    console.error(error);
                    const errorElement = document.querySelector("p.msg-error");
                    errorElement.textContent ="Email/Mot de passe incorrect. Veuillez saisir à nouveau";
                }); 
               
        }        );