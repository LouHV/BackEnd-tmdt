import icons from "./icons"
const { BsStar, BsStarFill } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()

export const renderStartFromNumber = (number) => {
    if (!Number(number)) return null; // Nếu number không phải là một số, trả về null
    const stars = [];
    for (let i = 0; i < number; i++) stars.push(<BsStarFill color="orange" key={i} />);
    for (let i = number; i < 5; i++) stars.push(<BsStar color="orange" key={i} />);
    return stars; // Trả về mảng chứa các biểu tượng sao
};