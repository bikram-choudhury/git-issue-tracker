import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Badge, Card } from 'react-bootstrap';
import Markdown from 'markdown-to-jsx';

function IssueDetails({ repoName, match }) {
    const { issueId } = match.params;
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const URL = `https://api.github.com/repos/${repoName}/issues/${issueId}`;
        Axios.get(URL).then(response => {
            const { title, number, state, body, user } = response.data;
            setDetails({ title, number, state, body, creator: user.login });

        }).catch(error => console.log(error))
    }, [repoName, issueId]);

    if (!details) {
        return null;
    }
    return (
        <div className="issue-details">
            <h3>{details.title} # {details.number}</h3>
            <Badge variant="success">{details.status}</Badge>
            <Card>
                <Card.Title style={{ margin: '10px' }}>
                    <strong>{details.creator}</strong>
                </Card.Title>
                <Card.Body>
                    <Markdown>{details.body}</Markdown>
                </Card.Body>
            </Card>
        </div>
    )
}

export default IssueDetails
