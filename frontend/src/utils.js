export const convertDate = (date) => {
    if(date){
        date = date.split('T')[0].split('-')
        return date.reverse().join('/')
    }
    return date
} 