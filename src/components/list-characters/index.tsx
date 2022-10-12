import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import NoResults from "components/no-results";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import { getCharacters } from "services/api-call";
import { setMenuShow, setPage } from "store/actions";
import {
  genderFilterSelector,
  nameCharacterFilterSelector,
  pageSelecter,
  showMenuSelector,
  statusFilterSelector,
} from "store/selectors";
import { CharacterInfo } from "utils/types";
import CardCharacter from "./card";
import Sidebar from "./sidebar";
import "./styles.scss";

const ListCharacters = () => {
  const dispatch = useDispatch();
  const [characters, setCharacters] = useState<Array<CharacterInfo>>([]);
  const [countPages, setCountPages] = useState(0);
  const showMenu: boolean = useSelector(showMenuSelector);
  const nameFilter: string = useSelector(nameCharacterFilterSelector);
  const statusFilter: string = useSelector(statusFilterSelector);
  const genderFilter: string = useSelector(genderFilterSelector);
  const page: number = useSelector(pageSelecter);

  useEffect(() => {
    getCharacters(nameFilter, statusFilter, genderFilter, page)
      .then((response) => {
        setCountPages(response.info.pages);
        setCharacters(
          response.results.map((character: any) => {
            return {
              image: character.image,
              name: character.name,
              specie: character.species,
              status: character.status,
              id: character.id,
              type: character.type,
              gender: character.gender,
              origin: character.origin.name,
              created: new Date(character.created).toLocaleDateString(),
              episodes: character.episode,
            } as CharacterInfo;
          })
        );
      })
      .catch(() => setCharacters([]));
  }, [nameFilter, statusFilter, genderFilter, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatch(setPage(page));
  };

  return (
    <Box
      sx={{
        marginTop: "60px",
        display: { md: "flex" },
        flexDirection: { md: "row" },
        height: "100%",
      }}
    >
      <Sidebar />
      {characters.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="main"
            onClick={() => {
              showMenu && dispatch(setMenuShow(false));
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "inline" },
                flexDirection: { xs: "column" },
                alignItems: "center",
              }}
            >
              {characters.map((character: CharacterInfo) => (
                <CardCharacter key={character.id} character={character} />
              ))}
            </Box>
          </div>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginLeft: { md: "-140px" },
          }}
        >
          <NoResults />
        </Box>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#dddbdb",
        }}
      >
        <div className="footer__pagination">
          {characters.length > 0 && (
            <Pagination
              page={page}
              count={countPages}
              size={"small"}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
      <ScrollToTop smooth />
    </Box>
  );
};

export default ListCharacters;
