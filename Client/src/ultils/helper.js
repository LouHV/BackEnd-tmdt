import icons from "./icons"
const { BsStar, BsStarFill } = icons

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-')
export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()

export const renderStartFromNumber = (number, size) => {
    if (!Number(number)) return null; // Nếu number không phải là một số, trả về null
    const stars = [];
    
    for (let i = 0; i < number; i++) stars.push(<BsStarFill color="orange" size={size || 16} key={i} />);
    for (let i = number; i < 5; i++) stars.push(<BsStar color="orange" size={size || 16} key={i} />);
    if(number === 0 || number === null){ // Kiểm tra xem number có bằng 0 hoặc null không
        for (let i = 0; i < 5; i++) stars.push(<BsStar color="orange" size={size || 16} key={i} />);
    }
    return stars; // Trả về mảng chứa các biểu tượng sao
};

export const invalidate = (payload, setInvalidFields) => {
    let invalids = 0
    const formatPayload = Object.entries(payload)
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++
            setInvalidFields(prev => [...prev, { name: arr[0], message: 'Requied this fields.' }])
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^(.+)@(\S+)$/
                if (!arr[1].match(regex)) {
                    invalids++
                    setInvalidFields(prev => [...prev, { name: arr[0], message: 'Input is Email.' }])
                }
                break
            default:
                break
        }
    }

    return invalids
}

export const formatPrice = number => Math.round(number / 1000) * 1000