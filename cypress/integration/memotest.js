const URL = '127.0.0.1:8080';

context('Memotest', () => {
    const MEMOBLOCKS_NUMBER = 18;

    before(() => {
        cy.visit(URL);
    });

    it('makes sure there is a board', () => {
        cy.get('#memo-block-board').find('.memo-block').should('have.length', MEMOBLOCKS_NUMBER);
    });

    it('makes sure that the blocks are random', () => {
        const characters = [];
        const newCharacters = [];

        cy.get('#btn-play').click();

        cy.get('.memo-block').then(memos => {
            memos.each((i, memo) => {
                characters.push(memo.dataset.char);
            });
        });

        cy.visit(URL);
        cy.get('#btn-play').click();

        cy.get('.memo-block').then(memos => {
            memos.each((i, memo) => {
                newCharacters.push(memo.dataset.char);
            });
        });

        cy.wrap(characters).should('not.deep.equal', newCharacters);
        cy.visit(URL);
    });

    describe('solve the game', () => {
        let pairsMap, pairsList;

        it('choose a wrong combination', () => {
            cy.visit(URL);
            cy.get('#btn-play').click();

            cy.get('.memo-block').then(memos => {
                pairsMap = getPairs(memos);
                pairsList = Object.values(pairsMap);

                setTimeout(() => {
                    pairsList[0][0].click();
                    pairsList[1][0].click();
                }, 2600);

                cy.wait(3000);
                cy.get('#memo-block-board').find('.memo-block').should('not.have.class', 'flip');
            });
        });

        it('solve the game', () => {
            pairsList.forEach((pair, i) => {
                setTimeout(() => {
                    pair[0].click();
                    pair[1].click();
                }, 810 * i);
            });

            cy.wait(810 * pairsList.length);
            cy.get('#memo-block-board').find('.memo-block').should('have.class', 'flip');
        });

    });
});

function getPairs(memos){
    const pairs = {};

    memos.each((i, memo) => {
        const character = memo.dataset.char;

        if(pairs[character]){
            pairs[character].push(memo);
        }
        else{
            pairs[character] = [memo];
        }
    });

    return pairs;
}