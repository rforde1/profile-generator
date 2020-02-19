const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const generateHTML = require("./generateHTML");
const HTML5ToPDF = require("html5-to-pdf")
const path = require("path")

const questions = [
  {
      type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["blue", "red","green", "pink"]
  },
  {
    type :"input",
    name: "username",
    message: "What is your Github username",
    
  }
];
userProfile();


  async function userProfile(){
  const userInfo = await getQuestions();
  console.log(userInfo.username);
  const user = await userInput(userInfo.username);
  console.log(user)
  const repos = await getRepos(userInfo.username);
  const stars = getStars(repos);
 
 
   const newProfile = new Profile(
    user.data.avatar_url,
    user.data.login,
    user.data.location,
    user.data.bio,
    user.data.repos_url,
    user.data.followers,
    user.data.following,
    stars,
    userInfo.color,
    user.data.public_repos,
    user.data.html_url,
    user.data.blog
    );

    console.log(newProfile.profileimage);
    
    fs.writeFile("index.html", generateHTML(newProfile), err =>{
      if(err)throw err;
      run();
    })


  // }
  }


//  html to pdf
const run = async () => {
  const html5ToPDF = new HTML5ToPDF({
    inputPath: path.join(__dirname,"index.html"),
    outputPath: path.join(__dirname, "output.pdf"),
  })
 
  await html5ToPDF.start()
  await html5ToPDF.build()
  await html5ToPDF.close()
  console.log("DONE")
  process.exit(0)
}
  
// constructor used to hold values for generateHTML.js
const Profile = function(profileimage, username, location, bio, repos,followers, following, stars, color, public,html, blog){
  this.profileimage = profileimage;
  this.username = username;
  this.location = location;
  this.bio = bio;
  this.repos = repos;
  this.followers = followers;
  this.following = following;
  this.stars = stars;
  this.color =color;
  this.public = public;
  this.html = html;
  this.blog = blog;
}
// git hub url
const queryUrl = `https://api.github.com/users/`;

// function to get github username
function userInput(username){
  console.log(queryUrl + username);
 return axios.get(queryUrl + username).catch( e =>{
    console.log(" I have error retreving results")
  });
 
}
// function to get github repos
function getRepos(username){
  return axios.get(queryUrl + username + "/repos").catch(e =>{
    console.log("I have an error getting repos");
  });
}
// function to return questions from const questions
function getQuestions(){
  return inquirer.prompt(questions);
  // returning questions
}
// used to get stars from repo
function getStars (repo){
  let stars = 0;
  repo.data.forEach(starCount =>{
    stars += starCount.stargazers_count;
  })
  return stars;
}

