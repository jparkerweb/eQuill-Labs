export const USER_REPOS_QUERY = /* GraphQL */ `
	query UserRepos($login: String!, $cursor: String) {
		user(login: $login) {
			login
			name
			bio
			avatarUrl
			url
			repositories(
				first: 100
				after: $cursor
				ownerAffiliations: OWNER
				privacy: PUBLIC
				orderBy: { field: PUSHED_AT, direction: DESC }
			) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					name
					description
					url
					homepageUrl
					stargazerCount
					forkCount
					primaryLanguage {
						name
						color
					}
					languages(first: 10) {
						edges {
							size
							node {
								name
							}
						}
						totalSize
					}
					repositoryTopics(first: 20) {
						nodes {
							topic {
								name
							}
						}
					}
					licenseInfo {
						spdxId
					}
					pushedAt
					updatedAt
					createdAt
					issues(states: OPEN) {
						totalCount
					}
					isArchived
					isFork
					readme: object(expression: "HEAD:README.md") {
						... on Blob {
							text
						}
					}
				}
			}
		}
	}
`;
