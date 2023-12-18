describe('Api Test', () => {
    beforeEach(() => {
        cy.visit('https://swapi.dev/');

    })
    
    it('Test 1: Checking people #2', () => {
        cy.request({
            method: 'GET',
            url : 'api/people/2/',
        }).then((response) => {
            console.log(response);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('skin_color', 'gold');
            expect(response.body).to.have.property('films').length(6);

        })
    })

    it('Test 2: Checking 2nd movie', () => {
        cy.request({
            method: 'GET',
            url: 'api/people/2/',
        }).then((response) => {
            console.log(response);
            expect(response.status).to.eq(200);
            return response.body.films[1];

        }).then(secondMovie => {
            cy.request({
                method: 'GET',
                url: secondMovie,
            }).then((response) => {
                expect(response.status).to.eq(200);

                //const releaseDate = response.body.release_date;
                const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
                expect(response.body.release_date).to.match(dateFormat);

                //expect(releaseDate).to.match(dateFormat);

                expect(response.body.characters).to.have.length.of.at.least(1);
                expect(response.body.planets).to.have.length.of.at.least(1);
                expect(response.body.starships).to.have.length.of.at.least(1);
                expect(response.body.vehicles).to.have.length.of.at.least(1);
                expect(response.body.species).to.have.length.of.at.least(1);
                return response.body.planets[0];
            }).then(firstPlanet => {
                cy.request({
                    method: 'GET',
                    url: firstPlanet,
                }).then((response) => {
                    expect(response.status).to.eq(200);

                    cy.fixture('apiPlanetData').then((expectedData) => {
                        expect(response.body.gravity).to.eq(expectedData.gravity);
                        expect(response.body.terrain).to.eq(expectedData.terrain);

                    })

                    cy.request({
                        method: 'GET',
                        url: 'api/planets/4/'
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(firstPlanet).to.deep.equal('https://swapi.dev/api/planets/4/');
                    })
                    
                })
            })           
            
        })
    })

    it.only('Test 3: Error 404', () => {
        cy.request({
            method: 'GET',
            url : 'api/films/7/',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);

        })
    })

})