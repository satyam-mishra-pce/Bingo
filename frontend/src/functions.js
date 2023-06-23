export const getRandomNumbers = ulimit => {
    let numbers = [];
    for (let i = 1; i <= ulimit; i++) {
        numbers.push(i);
    }
    let randomNumbers = [];
    for (let i = 1; i <= ulimit; i++) {
        const spliceIndex = Math.floor(Math.random() * ulimit) % numbers.length;
        const number = numbers.splice(spliceIndex, 1)[0];
        randomNumbers.push(number.toString());
    }
    return randomNumbers;
}