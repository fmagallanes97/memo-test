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
    });

    describe('solve the game', () => {
        let pairsMap, pairsList;
        
        it('choose a wrong combination', () => {
            cy.clock();
            cy.visit(URL);
            cy.get('#btn-play').click();

            cy.get('.memo-block').then(function(memos){
                pairsMap = getPairs(memos);
                pairsList = Object.values(pairsMap);

                this.clock.tick(2600);

                pairsList[0][0].click();
                pairsList[1][0].click();

                this.clock.tick(800);

                cy.get('#memo-block-board').find('.flip').should('have.length', 0);
            });
        });

        it('solve the game', () => {
            cy.clock();

            pairsList.forEach(pair => {
                cy.tick(800);
                cy.get(pair[0]).click();
                cy.get(pair[1]).click();
            });

            cy.get('#memo-block-board').find('.flip').should('have.length', MEMOBLOCKS_NUMBER);
            cy.get('#dashboard').find('#moves').should('have.text', (pairsList.length + 1).toString());
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