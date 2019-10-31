const configObj = {
  method: "GET",
  headers: {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "idmyn"
  }
}

document.querySelector("#github-form").addEventListener("submit", e => {
  e.preventDefault()
  const query = document.querySelector("#search").value
  clearLists()
  if (document.querySelector("#user-radio").checked) {
    searchForUsers(query).then(users => {
      const ul = prepareUserList()
      users.forEach(user => injectUser(ul, user))
    })
  } else {
    searchForRepos(query).then(repos => {
      const ul = document.querySelector("#repos-list")
      removeChildren(ul)
      repos.forEach(repo => {
        injectRepo(ul, repo)
      })
    })
  }
})

function clearLists() {
  const lists = document.querySelectorAll("ul")
  lists.forEach(list => removeChildren(list))
}

function removeChildren(parent) {
  while (parent.firstChild) {
    // https://stackoverflow.com/a/3955238
    parent.removeChild(parent.firstChild)
  }
}

function prepareUserList() {
  const ul = document.querySelector("#user-list")
  const li = document.createElement("li")
  li.innerHTML = "<header><strong>users</strong></header>"
  ul.append(li)
  return ul
}

function searchForUsers(query) {
  const URI = `https://api.github.com/search/users?q=${query}`
  return fetch(URI, configObj)
    .then(response => response.json())
    .then(json => json.items)
}

function injectUser(ul, user) {
  const userLi = document.createElement("li")
  userLi.textContent = user.login
  userLi.addEventListener("click", e => {
    lookupUserRepos(e, user.repos_url).then(repos => {
      const ul = prepareUserRepoList(user)
      repos.forEach(repo => injectRepo(ul, repo))
    })
  })
  ul.append(userLi)
}

function prepareUserRepoList(user) {
  const ul = document.querySelector("#repos-list")
  removeChildren(ul)
  const li = document.createElement("li")
  li.innerHTML = `<header><strong>${user.login}'s repos</strong></header>`
  ul.append(li)
  return ul
}

function lookupUserRepos(e, URI) {
  return fetch(URI, configObj).then(response => response.json())
}

function injectRepo(ul, repo) {
  const li = document.createElement("li")
  li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
  ul.append(li)
}

function searchForRepos(query) {
  const URI = `https://api.github.com/search/repositories?q=${query}`
  return fetch(URI, configObj)
    .then(response => response.json())
    .then(json => json.items)
}
