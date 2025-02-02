import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useContext, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import CmdHostLockDwarf from "@/components/setup/CmdHostLockDwarf";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { saveIPDwarfDB } from "@/db/db_utils";

import { connectionHandler } from "@/lib/connect_utils";

export default function ConnectDwarf() {
  let connectionCtx = useContext(ConnectionContext);

  const [connecting, setConnecting] = useState(false);
  const [slavemode, setSlavemode] = useState(false);
  const [goLive, setGoLive] = useState(false);
  const [errorTxt, setErrorTxt] = useState("");

  async function checkConnection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formIP = formData.get("ip");
    let IPDwarf = formIP?.toString();

    if (IPDwarf == undefined) {
      return;
    }

    setConnecting(true);
    connectionCtx.setIPDwarf(IPDwarf);
    saveIPDwarfDB(IPDwarf);

    connectionHandler(
      connectionCtx,
      IPDwarf,
      true,
      setConnecting,
      setSlavemode,
      setGoLive,
      setErrorTxt
    );
  }

  function ipHandler(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.trim();
    if (value === "") return;

    saveIPDwarfDB(value);
    connectionCtx.setIPDwarf(value);
  }

  function renderConnectionStatus() {
    let goLiveMessage = "";
    if (goLive) {
      goLiveMessage = "=> Go Live";
    }
    if (connecting) {
      return <span className="text-warning-connect">{t("pConnecting")}</span>;
    }
    if (connectionCtx.connectionStatus === undefined) {
      return <></>;
    }
    if (connectionCtx.connectionStatus === false) {
      return (
        <span className="text-danger">
          {t("pConnectingFailed")}
          {errorTxt}.
        </span>
      );
    }
    if (connectionCtx.connectionStatusSlave || slavemode) {
      return (
        <span className="text-warning">
          {t("pConnectionSuccessFull")} (Slave Mode) {goLiveMessage}
          {errorTxt}.
        </span>
      );
    }

    return (
      <span className="text-success-connect">
        {t("pConnectionSuccessFull")} {goLiveMessage}
        {errorTxt}
      </span>
    );
  }

  const renderCmdHostLockDwarf = () => {
    // Your logic for rendering CmdHostLockDwarf
    // Example:
    return <CmdHostLockDwarf />;
  };
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);
  return (
    <div>
      <h2>
        {t("pConnectDwarfII", { DwarfType: connectionCtx.typeNameDwarf })}
      </h2>

      <p>
        {t("pConnectDwarfIIContent", {
          DwarfType: connectionCtx.typeNameDwarf,
        })}
      </p>

      <ol>
        <li className="mb-2">
          {t("pConnectDwarfIIContent1", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">{t("pConnectDwarfIIContent2")}</li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent3", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent4", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <li className="mb-2">
          {t("pConnectDwarfIIContent5", {
            DwarfType: connectionCtx.typeNameDwarf,
          })}
        </li>
        <form onSubmit={checkConnection} className="mb-3">
          <div className="row mb-3">
            <div className="col-md-1">
              <label htmlFor="ip" className="form-label">
                IP
              </label>
            </div>
            <div className="col-lg-2 col-md-10">
              <input
                className="form-control"
                id="ip"
                name="ip"
                placeholder="127.0.0.1"
                required
                defaultValue={connectionCtx.IPDwarf}
                onChange={(e) => ipHandler(e)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-more02 me-3">
            <i className="icon-wifi" /> {t("pConnect")}
          </button>{" "}
          {renderConnectionStatus()}
          {renderCmdHostLockDwarf()}
        </form>
        <li className="mb-4">{t("pConnectDwarfIIContent6")}</li>
      </ol>
    </div>
  );
}
