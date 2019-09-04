import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssuesList, FilterIssues, Pagination } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filter: 'all',
    page: 1
  }

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    const { filter, page } = this.state;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
          page: page,
          per_page: 5,
        }
      })
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    })
  }

  async componentDidUpdate(_, prevState) {

    if (prevState !== this.state) {
      const { match } = this.props;
      const repoName = decodeURIComponent(match.params.repository);
      const { filter, page } = this.state;

      const [repository, issues] = await Promise.all([
        api.get(`/repos/${repoName}`),
        api.get(`/repos/${repoName}/issues`, {
          params: {
            state: filter,
            page: page,
            per_page: 5,
          }
        })
      ]);

      this.setState({
        repository: repository.data,
        issues: issues.data,
        loading: false,
      })
    }
  }

  handleSelectChange = e => {
    this.setState({
      filter: e.target.value,
    })
  };

  prevPage = e => {
    if (this.state.page > 1) {
      this.setState({
        page: this.state.page - 1
      })
      this.componentDidUpdate();
    }
  }

  nextPage = e => {
    this.setState({
      page: this.state.page + 1
    })
    this.componentDidUpdate();
  }

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>
    }

    return (
      <Container>
        <Owner>
          <Link to="/"><FaArrowLeft></FaArrowLeft></Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <FilterIssues onChange={this.handleSelectChange}>
          <option value="all">Todos</option>
          <option value="open">Abertos</option>
          <option value="closed">Fechados</option>
        </FilterIssues>
        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
          <Pagination>
            <button onClick={this.prevPage} disabled={page === 1} ><FaArrowLeft></FaArrowLeft> Prev </button>
            <button onClick={this.nextPage} > Next <FaArrowRight></FaArrowRight></button>
          </Pagination>
        </IssuesList>
      </Container>
    );
  }
};
