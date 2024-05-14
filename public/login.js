console.log("ready")


const host = window.location.host

console.log("host", host)

const loginForm = document.getElementById("loginForm")
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  const fd = new FormData(loginForm)

  console.log(Array.from(fd.entries()))

  const response = await fetch("/login", {
    method: "POST",
    body: fd,
    redirect: "follow",
  })

  if (response.ok) {
    console.log("Login successful")
    window.location.assign("/app")
  } else {
    console.error("Login failed")
  }
})
