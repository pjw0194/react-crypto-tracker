import { useQuery } from "react-query";
import { useParams } from "react-router";
import { useLocation, Routes, Route, Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import Chart from "./Chart";
import Price from "./Price";
import { Helmet } from "react-helmet";

const Container = styled.div`
  position: relative;
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Previous = styled.div`
  position: absolute;
  top: 40px;
  left: 30px;
  font-size: 30px;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  display: block;
  text-align: center;
`;

const CoinInfo = styled.div`
  display: flex;
  width: 500px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.listColor};
  border-radius: 15px;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    text-transform: uppercase;
    font-size: 13px;
  }
`;

const CoinCol = styled.div`
  display: flex;
  height: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const CoinDescription = styled.div`
  width: 500px;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 20px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin: 15px 0px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  background-color: ${(props) => props.theme.listColor};
  width: 245px;
  height: 40px;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
`;

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

interface ICoinProps {
  isDark: boolean;
}

function Coin({ isDark }: ICoinProps) {
  const { coinId } = useParams();
  const location = useLocation();
  const state = location.state as RouteState;
  const priceMatch = useMatch("/:coindId/price");
  const chartMatch = useMatch("/:coindId/chart");

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId!),
    {
      refetchInterval: 5000,
    }
  );

  // const [info, setInfo] = useState<InfoData>();
  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // }, []);
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Previous>
        <Link to={`/`}>&larr;</Link>
      </Previous>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <CoinInfo>
            <CoinCol>
              <span>rank:</span>
              <span>{infoData?.rank}</span>
            </CoinCol>
            <CoinCol>
              <span>symbol:</span>
              <span>${infoData?.symbol}</span>
            </CoinCol>
            <CoinCol>
              <span>price:</span>
              <span>{tickersData?.quotes.USD.price}</span>
            </CoinCol>
          </CoinInfo>
          <CoinDescription>
            <p>{infoData?.description}</p>
          </CoinDescription>
          <CoinInfo>
            <CoinCol>
              <span>total supply:</span>
              <span>{tickersData?.total_supply}</span>
            </CoinCol>
            <CoinCol>
              <span>max supply:</span>
              <span>{tickersData?.max_supply}</span>
            </CoinCol>
          </CoinInfo>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to="chart">Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to="price">Price</Link>
            </Tab>
          </Tabs>

          <Routes>
            <Route path="price" element={<Price />} />
            <Route
              path="chart"
              element={<Chart coinId={coinId!} isDark={isDark} />}
            />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
