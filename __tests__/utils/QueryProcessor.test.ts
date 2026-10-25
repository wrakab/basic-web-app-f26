import QueryProcessor from "../../utils/QueryProcessor";
import '@testing-library/jest-dom'

describe("QueryProcessor", () => {
    test("should return a string", () => {
        const query = "test";
        const response: string = QueryProcessor(query);
        expect(typeof response).toBe("string");
    });

    test('should return shakespeare description', () => {
        const query = "shakespeare";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
            "English poet, playwright, and actor, widely regarded as the greatest " +
            "writer in the English language and the world's pre-eminent dramatist."
          ));
    });

    test('should return name', () => {
        const query = "What is your name?";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "Wassim"
          ));
    })

    test('should return andrew id', () => {
        const query = "What is your Andrew ID?";
        const response: string = QueryProcessor(query);
        expect(response).toBe((
            "wrakab"
          ));
    })

    test.each([
        ["What is 24 plus 12?", "36"],
        ["What is 5 plus 3 multiplied by 2?", "11"],
        ["What is 9 minus 15?", "-6"],
        ["What is 2 to the power of 64?", "18446744073709551616"],
        ["Which of the following numbers is the largest: 45, 922, 17?", "922"],
        ["Which of the following numbers is both a square and a cube: 64, 729, 50?", "64, 729"],
        ["Which of the following numbers are primes: 4, 7, 13, 21?", "7, 13"],
        ["Who is the Prime Minister of Great Britain?", "Keir Starmer"],
        ["What is the 17th number in the Fibonacci sequence?", "1597"],
    ])('answers %s', (query, expected) => {
        expect(QueryProcessor(query)).toBe(expected);
    })
});
