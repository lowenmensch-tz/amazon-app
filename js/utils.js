function formatCurrency(value){
    let format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    return format;
}


function generatePrice(max, min){
    let random = Math.round(Math.random() * (max - min) + min);
    let price = formatCurrency(random);
    return price;
}


function raiting(calification){
    
    drawStar = [];

    for (let index = 0; index < 5; index++) {
        if(calification <= index){
            drawStar.push(`<a><i class='bx bx-star'></i></a>`);
        }else{
            drawStar.push(`<a><i class='bx bxs-star'></i></a>`);
        }
    }

    return drawStar.join(' ');
}