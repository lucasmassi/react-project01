import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List, ErrorMessage } from './styles';

export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: 0,
    error: null,
    messageError: null
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: 1 });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === '' || newRepo === 0) {
        throw 'Insira um nome de repositório';
      }

      const repoExists = repositories.find(repository => repository.name === newRepo);

      if (repoExists) {
        throw 'Repositório duplicado';
      }

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
      });

    } catch (error) {
      this.setState({
        error: 1,
        messageError: error
      });
    } finally {
      this.setState({ loading: 0 })
    }
  };


  render() {
    const { newRepo, loading, repositories, error, messageError } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar Repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
                <FaPlus color="#FFF" size={14} />
              )}
          </SubmitButton>
        </Form>
        <ErrorMessage error={error}>
          {error ? messageError : ''}
        </ErrorMessage>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}> Detalhes </Link>
            </li>
          ))}
        </List>
      </Container >
    );
  }
}
