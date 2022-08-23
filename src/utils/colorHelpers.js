export function stringToColor(str){
    let colors = ['#F0F8FF', '#fd5c63', '#4FFFB0', '#DDA0DD', '#F0E68C', '#FFC0CB', '#B2FFFF', '#DE3163', '#D0F0C0', '#D8BFD8', '#FFC72C', '#FF69B4', '#AFDBF5']
    let position = str.charCodeAt(0) - 'a'.charCodeAt(0);
    return colors[position/2];
}