const iceCreamList = document.querySelector('#iceCreamDisplay');
const formButton = document.querySelector('form button');

let iceCreamArray = [];

const clearIceCream = async ()=>{

    while(iceCreamList.children.length > 1){
        iceCreamList.removeChild(iceCreamList.lastChild);
    }    
}


formButton.addEventListener("click", async (e)=>{
    e.preventDefault();
    const {target} = e;
    console.log(target.parentElement[0].value)
    console.log(target.parentElement)
    let flavorName = target.parentElement[0].value;
    let flavorFavorite = target.parentElement[1].checked;
    

    console.log('Flavor Name: ', flavorName);
    console.log('flavorFavorite: ', flavorFavorite);
    console.log('Flavore Color : ' + flavorColor);

    try{
         const response = await fetch('/iceCreamAdd', {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            'name': flavorName,
            'favorite': flavorFavorite,
            // 'color': flavorColor
        })
       
    } );  
        if(!response.ok){
            throw error;
        }
    }catch(error){
        alert("THERE WAS A PROBLEM ADDING THAT FLAVOR, PLEASE TRY AGAIN.");
        
    }
   
    // if(!response.ok){
    //     alert("THERE WAS A PROBLEM ADDING THAT FLAVOR, PLEASE TRY AGAIN");
    // }
    // console.log(response);
    await clearIceCream();
    await displayIceCream();

})


const removeButtonAction = async ({target})=>{

    console.log(target.value);
    let {value} = target;
    try{
        const response = await fetch('flavorDelete/:' + parseInt(value), {
        method: 'DELETE',        
    })
    await clearIceCream();
    await displayIceCream();
}catch(error){
    console.log(error);
    alert('THERE WAS AN ERROR IN DELETING THIS FLAVOR.  PLEASE TRY AGAIN.')
}
    
    





};


const favoriteButtonAction = async ({target})=>{

    console.log(target.value)

    let favorite = target.value;
    const id = target.previousSibling. value;

   favorite = (favorite === 'true')? false : true;

   console.log(favorite);

    const response =  await  fetch('flavorSetFavorite/'+favorite +'/'+id,{
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({
        //     'favorite': favorite,
        //     'id': id,            
        // })



    } )

    await clearIceCream();
    await displayIceCream();


}











const displayIceCream = ( async ()=>{

        const iceCreams = await fetch('/getAllFlavors',{
            method: "GET", 
        });

        const data = await  iceCreams.json();
        iceCreamArray = data;
        

        await data.map((iceCream, index)=>{
            const iceCreamDiv = document.createElement('div');
            iceCreamDiv.setAttribute('class', 'iceCreamDiv');
            
            

            const iceCreamName = document.createElement("div");
            iceCreamName.setAttribute('class', 'iceCreamName');
            iceCreamName.innerText = 'FLAVOR: ' + iceCream.flavor_name;

            const iceCreamFavorite = document.createElement("div");
            iceCreamFavorite.setAttribute('class', 'iceCreamFavorite');
            iceCreamFavorite.innerText = "FAVORITE: " + iceCream.is_favorite;

            const iceCreamCreated = document.createElement("div");
            iceCreamCreated.setAttribute('class', 'iceCreamCreated');
            iceCreamCreated.innerText = "CREATED: " + iceCream.created_at;

            const iceCreamUpdated = document.createElement("div");
            iceCreamUpdated.setAttribute('class', 'iceCreamUpdated');
            iceCreamUpdated.innerText = "UPDATED: " + iceCream.updated_at;

            


            const  iceCreamButtons = document.createElement('div');
            iceCreamButtons.setAttribute('class', 'iceCreamButtons');

            const removeButton = document.createElement('button');
            const favoriteButton = document.createElement('button');

            removeButton.innerText= 'REMOVE';
            removeButton.setAttribute('value', iceCream.flavor_id)

            favoriteButton.innerText='FAVORITE';
            favoriteButton.setAttribute('value', iceCream.is_favorite);

            removeButton.addEventListener('click', (e)=>{removeButtonAction(e)});
            favoriteButton.addEventListener('click', (e)=>{favoriteButtonAction(e)});

            iceCreamButtons.append(removeButton);
            iceCreamButtons.append(favoriteButton);

            


            iceCreamDiv.append(iceCreamName);
            iceCreamDiv.append(iceCreamFavorite);
            iceCreamDiv.append(iceCreamCreated);
            iceCreamDiv.append(iceCreamUpdated);

            const iceCreamSquare = document.createElement('div');
            iceCreamSquare.setAttribute('class', 'iceCreamSquare');
            iceCreamSquare.append(iceCreamDiv);
            iceCreamSquare.append(iceCreamButtons);

            
            iceCreamList.append(iceCreamSquare);
            
    

        })

        
})


displayIceCream();








// iceCreamArray.map((flavor, index)=>{
//     console.log("THIS IS THE FLAVOR: ",flavor);
// })