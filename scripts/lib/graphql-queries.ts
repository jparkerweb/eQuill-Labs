export const USER_REPOS_QUERY = /* GraphQL */ `
	query UserRepos($login: String!, $cursor: String) {
		user(login: $login) {
			login
			name
			bio
			avatarUrl
			url
			repositories(
				# Page size kept small on purpose: each node pulls the full README
				# blob plus languages(10) + topics(20) + license + issues. At
				# first: 100 the combined complexity periodically trips GitHub's
				# GraphQL node/timeout limit, which surfaces as a bare nginx 502.
				# first: 25 stays comfortably under that ceiling; the script
				# paginates the rest with a polite pause between pages.
				first: 25
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
					defaultBranchRef {
						name
					}
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
