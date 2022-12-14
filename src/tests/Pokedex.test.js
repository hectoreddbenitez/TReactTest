import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../utils/RenderWithRoute';

import { Pokedex } from '../components';
import pokemons from '../data';

const favoritesID = {
  4: false,
  10: false,
  23: false,
  25: false,
  65: false,
  78: false,
  143: false,
  148: false,
  151: false,
};

const PokemonTypeOff = 7;

describe('Pokedex.js test', () => {
  test('Se página contém um heading h2 com o texto Encountered pokémons', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ favoritesID }
    />);
    const enconuteredTitle = screen.getByRole('heading', {
      name: /encountered pokémons/i,
      value: 2,
    });
    expect(enconuteredTitle).toBeInTheDocument();
  });

  test('Se é exibido o próximo Pokémon da lista'
  + 'quando o botão Próximo pokémon é clicado', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ favoritesID }
    />);
    const pokemon = screen.getByTestId('pokemon-name');
    expect(pokemon.innerHTML).toBe('Pikachu');
    expect(pokemon).toBeInTheDocument();
    const buttonNextPoke = screen.getByRole('button', {
      name: /próximo pokémon/i,
    });
    const allbtn = screen.getByRole('button', { name: /all/i });

    userEvent.click(buttonNextPoke);
    expect(pokemon.innerHTML).toBe('Charmander');
    expect(pokemon).toBeInTheDocument();
    expect(allbtn).toBeInTheDocument();
  });

  test('O primeiro Pokémon da lista deve ser mostrado ao clicar no botão,'
  + 'se estiver no último Pokémon da lista', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons.slice(0, 2) }
      isPokemonFavoriteById={ favoritesID }
    />);
    const pokeName = screen.getByTestId('pokemon-name');
    expect(pokeName.innerHTML).toBe('Pikachu');
    const buttonNextPoke = screen.getByRole('button', {
      name: /próximo pokémon/i,
    });
    userEvent.click(buttonNextPoke);
    expect(pokeName.innerHTML).toBe('Charmander');

    userEvent.click(buttonNextPoke);
    expect(pokeName.innerHTML).toBe('Pikachu');
  });
  test('Se a Pokédex tem os botões de filtro.', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ favoritesID }
    />);
    const typeBtn = screen.getAllByTestId('pokemon-type-button');
    expect(typeBtn).toHaveLength(PokemonTypeOff);
  });

  test('correto funcionamento dos botões de filtro.', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ favoritesID }
    />);
    const typePsychicBtn = screen.getByRole('button', {
      name: /psychic/i,
    });
    userEvent.click(typePsychicBtn);
    const alakazamPoke = screen.getByText(/alakazam/i);
    const psychicTypeOff = screen.getByText(/psychic/i, { selector: 'p' });
    const allbtn = screen.getByRole('button', { name: /all/i });

    expect(alakazamPoke).toBeInTheDocument();
    expect(psychicTypeOff).toBeInTheDocument();
    expect(allbtn).toBeInTheDocument();

    const buttonNextPoke = screen.getByRole('button', {
      name: /próximo pokémon/i,
    });
    userEvent.click(buttonNextPoke);

    const mewPoke = screen.getByText(/mew/i);
    expect(mewPoke).toBeInTheDocument();
    expect(allbtn).toBeInTheDocument();

    const typePoisonBtn = screen.getByRole('button', {
      name: /poison/i,
    });
    userEvent.click(typePoisonBtn);

    const poisonTypeOff = screen.getByText(/poison/i, { selector: 'p' });
    expect(poisonTypeOff).toBeInTheDocument();
  });
  test('Se o botão All resetea os filtros', () => {
    renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ favoritesID }
    />);
    const allbtn = screen.getByRole('button', { name: /all/i });
    const typeBtn = screen.getAllByTestId('pokemon-type-button');
    const initialType = screen.getByText(/electric/i, { selector: 'p' });

    userEvent.click(typeBtn[1]);
    userEvent.click(allbtn);

    expect(initialType).toBeInTheDocument();
  });
});
