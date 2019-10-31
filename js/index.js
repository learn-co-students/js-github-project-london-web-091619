document.addEventListener('DOMContentLoaded',function(){
    const form = document.querySelector("#github-form")
    const submitButton = form.querySelector('input[type="submit"]')
    
    
    submitButton.addEventListener('click', search)

})


function search(e){
    e.preventDefault()
    const form = document.querySelector("#github-form")
    const searchInput = form.querySelector('#search')
    let val 
    fetchUser(searchInput)
        .then(function(users){
            renderUsers(users)
        })
        
}


function fetchUser(searchInput){

    return fetch(`https://api.github.com/search/users?q=${searchInput.value}`)
        .then(function(response){
            return response.json()
        })
}

function renderUsers(users){
    usersList = document.querySelector('#user-list')
    usersList.innerHTML = ""
    total = document.createElement("h1")
    total.innerText = `We found ${users.total_count} users.`
    usersList.appendChild(total)

    users.items.forEach(function(user){
        newLi = document.createElement("li")

        
        nameA = document.createElement("a")
        nameA.href = user.html_url
        nameA.innerText = user.login

        newImg = document.createElement("img")
        newImg.src = user.avatar_url

        newButton = document.createElement("button")
        newButton.id = user.repos_url
        newButton.innerText = "Get Repos"
        newButton.addEventListener('click', function(e){
            e.preventDefault()
            
            getRepos(e.target.id)


        })

        
        

        newLi.appendChild(nameA)
        newLi.appendChild(newImg)
        newLi.appendChild(newButton)
        usersList.appendChild(newLi)
        
    })
}

function getRepos(repos_url){
    
    fetchRepos(repos_url)
        .then(function(repos){
            
            renderRepos(repos)
        })
}

function fetchRepos(repos_url){
    
    return fetch(repos_url)
    .then(function(response){
        
        return response.json()
    })
}

function renderRepos(repos){
    reposList = document.querySelector('#repos-list')
    reposList.innerHTML = ""
    total = document.createElement("h1")
    total.innerText = `We found ${repos.length} repos.`
    reposList.appendChild(total)

    repos.forEach(function(repo){
        newLi = document.createElement("li")

        nameA = document.createElement("a")
        nameA.href = repo.html_url
        nameA.innerText = repo.name

        newLi.appendChild(nameA)
        reposList.appendChild(newLi)
    })
}
