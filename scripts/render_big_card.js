function openBigTask(){
  let renderBigCardRef = document.getElementById("big-card-container");
  renderBigCardRef.innerHTML +=  bigCardTemplate(); ;
}
openBigTask();