export function capitaliseFirstLetters(input) {
    const words = input.split(' ');
    const formattedWords = words.map((word) => {
        return word === 'MPS' ? word : word[0] + word.slice(1).toLowerCase();
    }).join(' ');
    return formattedWords
}