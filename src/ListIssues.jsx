import React, { Fragment, useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { Table, Form, Nav, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ListIssues({ repoName }) {

    const [searchInput, setSearchInput] = useState('');
    const [issuesonSearch, setIssuesOnSearch] = useState(null);
    const [openICOnSearch, setOpenICOnSearch] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [PItems, setPItems] = useState([]);

    const handleKeyDown = useCallback(event => {

        if (event.keyCode === 13) {
            let URL = `https://api.github.com/search/issues?q=repo:${repoName}+type:issue+state:open+${searchInput}&per_page=10`;
            URL += `&page=${pageNumber}`;

            Axios.get(URL).then(response => {
                const { total_count, items } = response.data;
                const modifiedIssues = items.map(item => ({
                    url: item.url,
                    id: item.id,
                    number: item.number,
                    title: item.title,
                    creator: { name: item.user.login },
                    created_at: item.created_at,
                    last_updated_at: item.updated_at,
                    body: item.body
                }));
                setIssuesOnSearch(modifiedIssues);
                setOpenICOnSearch(total_count);

                const pages = [];
                for (let number = 1; number <= modifiedIssues.length; number++) {
                    pages.push(
                        <Pagination.Item
                            key={number}
                            active={number === pageNumber}
                            disabled={number === pageNumber}
                            onClick={() => {
                                setPageNumber(number);
                                handleKeyDown({ keyCode: 13 })
                            }}
                        >
                            {number}
                        </Pagination.Item>
                    );
                }
                setPItems([...pages]);

            }).catch(error => console.log(error))
        }
    }, []);
	
	useEffect(() => {
		handleKeyDown({keyCode: 13});
	}, [handleKeyDown]);


    return (
        <Fragment>
            <div className="search-input">
                <Form.Control
                    type="text"
                    placeholder="Search: open issues"
                    onChange={event => setSearchInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {
                !issuesonSearch ? null : (issuesonSearch.length ? (
                    <div className="list-issues">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{openICOnSearch} Open</th>
                                    <th>Closed</th>
                                    <th>Labels Filter</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    issuesonSearch.map(issue => {
                                        return (
                                            <tr key={issue.number}>
                                                <td colSpan={3}>
                                                    <Link as={Nav.Item} to={`/issues/${issue.number}`}>
                                                        {issue.title}
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className="pagination-block">
                            <Pagination>{PItems}</Pagination>
                        </div>
                    </div>

                ) : <h2>No Data found</h2>)
            }
        </Fragment>

    )
}

export default ListIssues
