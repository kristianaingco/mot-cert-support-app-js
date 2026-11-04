import ProjectList from '../components/ProjectList';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import nock from 'nock';

nock("http://localhost")
    .persist()
    .get("/v1/project")
    .reply(200, [{
        "id": 1,
        "name": "Project 1",
        "description": "Project 1 description",
    }, {
        "id": 2,
        "name": "Project 2",
        "description": "Project 2 description",
    }]);

describe("ProjectList", () => {
    it("should render a list of projects", async () => {
        const {asFragment} = render(<MemoryRouter><ProjectList /></MemoryRouter>);

        await screen.findByText("Project 1");

        expect(asFragment()).toMatchSnapshot();
    });
});