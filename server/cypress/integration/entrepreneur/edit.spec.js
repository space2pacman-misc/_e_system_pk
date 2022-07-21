describe('entrepreneur edit', () => {
    it('Отправка запроса с другим значением заголовка content-type', () => {
        cy.request({
            url: '/entrepreneur/edit/',
            method: 'POST',
            headers: {
                'content-type': 'invalid'
            }
        })
        .then(response => {
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('message');
            expect(response.body.message).contains('Invalid header');
        });
    });

    it('Отправка пустого объекта', () => {
        cy.request('POST', '/entrepreneur/edit/', {})
        .then(response => {
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('message', 'Value cannot be empty for id');
        });
    });

    it('Отправка неверного типа данных(ID)', () => {
        cy.request('POST', '/entrepreneur/edit/', { id: '1000000000' })
        .then(response => {
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('message', 'Invalid data type for id. Expected: number, instead got: string');
        });
    });

    it('Отправка отсутствующего ID', () => {
        cy.request('POST', '/entrepreneur/edit/', { id: 1000000000 })
        .then(response => {
            expect(response.body).to.have.property('status', 'error');
            expect(response.body).to.have.property('message', 'not found by id: 1000000000');
        });
    });
})