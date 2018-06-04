import React, { Fragment } from 'react';
import {
  Box,
  Card,
  Flex,
  OverlayTrigger,
  Modal,
  Button,
  List,
  Header,
} from '@procore/core-react';
import { Query } from 'react-apollo';
import ErrorMessage from '../../Error';
import Loading from '../../Loading';

import { GET_SINGLE_POKEMON_QUERY } from '../queries';

import PokemonPopup from '../PokemonPopup';

const ModalBody = ({ id, image, name }) => (
  <Fragment>
    <Flex direction="column">
      <img
        alt={name}
        src={image}
        style={{
          height: 100,
          width: 100,
        }}
      />
    </Flex>
    <Query
      query={GET_SINGLE_POKEMON_QUERY}
      variables={{ id }}
      notifyOnNetworkStatusChange
    >
      {({ data, loading, error }) => {
        if (error) {
          return <ErrorMessage error={error} />;
        }

        const { pokemon } = data;

        if (loading && !pokemon) {
          return <Loading loading={loading} />;
        }

        return (
          <Box
            style={{
              marginTop: '15px',
              marginBottom: '15px',
              padding: '10px',
              boxShadow: '0 1px 2px rgba(0,0,0,.2), 0 1px 3px rgba(0,0,0,.1)',
            }}
          >
            <Header.H3>Classification</Header.H3>
            <List>
              <List.Item>{pokemon.classification}</List.Item>
            </List>
            <Header.H3>Weaknesses</Header.H3>
            <List>
              {pokemon.weaknesses.map(weakness => (
                <List.Item key={weakness}>{weakness}</List.Item>
              ))}
            </List>
          </Box>
        );
      }}
    </Query>
  </Fragment>
);

const PokemonCard = ({ id, name, image, classification }) => (
  <Box margin="md">
    <Card variant="hoverable" style={{ width: '200px' }}>
      <OverlayTrigger
        trigger="hover"
        overlay={<PokemonPopup classification={classification} />}
      >
        <Box padding="md">
          <Flex direction="column">
            <Modal.State>
              {({ isShowing, show, hide }) => (
                <div>
                  <img
                    alt={name}
                    src={image}
                    style={{ height: 75, width: 75, marginBottom: 10 }}
                    onClick={show}
                  />
                  <h4 className="capitalize">{name}</h4>
                  <Modal open={isShowing} onClickOverlay={hide} placement="top">
                    <Fragment>
                      <Modal.Header onClose={hide}>{name}</Modal.Header>
                      <Modal.Body>
                        {isShowing && (
                          <ModalBody id={id} name={name} image={image} />
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Modal.FooterButtons>
                          <Button variant="tertiary" onClick={hide}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={hide}>
                            Add To Team
                          </Button>
                        </Modal.FooterButtons>
                      </Modal.Footer>
                    </Fragment>
                  </Modal>
                </div>
              )}
            </Modal.State>
          </Flex>
        </Box>
      </OverlayTrigger>
    </Card>
  </Box>
);

export default PokemonCard;
