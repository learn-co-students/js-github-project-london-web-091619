document.querySelector("#github-form").addEventListener("submit", e => {
  e.preventDefault()
  const query = document.querySelector("#search").value
  searchForUser(query).then(users => {
    const ul = prepareUserList()
    users.forEach(user => injectUser(ul, user))
  })
})

function prepareUserList() {
  const ul = document.querySelector("#user-list")
  removeChildren(ul)
  const li = document.createElement("li")
  li.innerHTML = "<header><strong>users</strong></header>"
  ul.append(li)
  return ul
}

function searchForUser(query) {
  const URI = `https://api.github.com/search/users?q=${query}`
  const configObj = {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "idmyn"
    }
  }
  return fetch(URI, configObj)
    .then(response => response.json())
    .then(json => json.items)
}

function injectUser(ul, user) {
  const userLi = document.createElement("li")
  userLi.textContent = user.login
  userLi.addEventListener("click", e => {
    lookupUserRepos(e, user.repos_url).then(repos => {
      const ul = prepareRepoList(user)
      repos.forEach(repo => injectRepo(ul, repo))
    })
  })
  ul.append(userLi)
}

function prepareRepoList(user) {
  const ul = document.querySelector("#repos-list")
  removeChildren(ul)
  const li = document.createElement("li")
  li.innerHTML = `<header><strong>${user.login}'s repos</strong></header>`
  ul.append(li)
  return ul
}

function lookupUserRepos(e, URI) {
  const configObj = {
    method: "GET",
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "idmyn"
    }
  }
  return fetch(URI, configObj).then(response => response.json())
}

function removeChildren(parent) {
  while (parent.firstChild) {
    // https://stackoverflow.com/a/3955238
    parent.removeChild(parent.firstChild)
  }
}

function injectRepo(ul, repo) {
  const li = document.createElement("li")
  li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
  ul.append(li)
}
