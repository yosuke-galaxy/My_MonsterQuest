import { useEffect, useState } from "react"
import "./App.css"
import { PLAYER_STATUS, SLIME_STATUS, WIZARD_STATUS } from "./constants"

type Scene = "STRAT" | "NAME_INPUT" | "BATTLE" | "RESULT"
type Turn =
  | "PLAYER_SELECT"
  | "SLIME_TURN"
  | "WIZARD_SELECT"
  | "MESSAGE_WAITING"
  | "RESULT"

function App() {
  const [scene, setScene] = useState<Scene>("STRAT")
  const [turn, setTurn] = useState<Turn>("PLAYER_SELECT")

  //名前
  const [playerName, setPlayerName] = useState("勇者")
  const [monsterName] = useState("スライム")
  const [wizardName] = useState("魔法使い")

  // ステータスを「状態」として管理（ダメージで減るため）
  const [playerHp, setPlayerHp] = useState(PLAYER_STATUS.hp)
  const [playerMp, setPlayerMp] = useState(PLAYER_STATUS.mp)
  const [slimeHp, setSlimeHp] = useState(SLIME_STATUS.hp)
  const [slimeMp, setSlimeMp] = useState(SLIME_STATUS.mp)
  const [wizardHp, setWizardHp] = useState(WIZARD_STATUS.hp)
  const [wizardMp, setWizardMp] = useState(WIZARD_STATUS.mp)

  const [message, setMessage] = useState("スライムがあらわれた！")

  //キー入力(Enterでメッセージ進行 )
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && scene === "BATTLE") {
        handleMessageClick()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [scene, turn, message])

  //メッセージウインドウの内容
  const handleMessageClick = () => {
    if (turn === "MESSAGE_WAITING") {
      setTurn("SLIME_TURN") // プレイヤーたちの行動が終わったらスライムへ
    }
  }

  // スライムの自動攻撃（useEffectでターンを監視）
  useEffect(() => {
    if (turn === "SLIME_TURN") {
      const timer = setTimeout(() => {
        const target = Math.random() < 0.5 ? "PLAYER" : "WIZARD"
        const damage = Math.max(1, SLIME_STATUS.attack - 5) // 簡易計算

        if (target === "PLAYER") {
          setPlayerHp((prev) => Math.max(0, prev - damage))
          setMessage(`スライムの攻撃！ ${playerName}は${damage}のダメージ！`)
        } else {
          setWizardHp((prev) => Math.max(0, prev - damage))
          setMessage(`スライムの攻撃！ ${wizardName}は${damage}のダメージ！`)
        }
        // 1.5秒後にプレイヤーの選択ターンに戻す
        setTimeout(() => {
          setTurn("PLAYER_SELECT")
          setMessage(`${playerName}はどうする？`)
        }, 1500)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [turn, playerName, wizardName])

  //通常攻撃時のダメージ計算
  const handleAttack = () => {
    const isCritical = Math.random() < 0.05 // 5%の確率でクリティカル
    // ダメージ計算ロジック
    let damage = Math.max(0, PLAYER_STATUS.attack - SLIME_STATUS.defense)
    if (isCritical) {
      damage *= 2 // クリティカルならダメージ2倍
      setMessage(`クリティカルヒット！ ${monsterName}に${damage}のダメージ！`)
    } else {
      setMessage(
        `${playerName}のこうげき！ ${monsterName}に${damage}のダメージ！`,
      )
    }
    setSlimeHp((prev) => Math.max(0, prev - damage)) // HPは0未満にならないように

    if (slimeHp - damage <= 0 || playerHp - damage <= 0) {
      setScene("RESULT")
    } else {
      setTurn("SLIME_TURN")
    }
  }

  //特技攻撃時のダメージ計算
  const handleSkill = () => {
    const isCritical = Math.random() < 0.05 // 5%の確率でクリティカル
    // ダメージ計算ロジック
    let damage = Math.max(0, PLAYER_STATUS.attack * 1.3 - SLIME_STATUS.defense)
    if (isCritical) {
      damage *= 2 // クリティカルならダメージ2倍
      setMessage(`クリティカルヒット！ ${monsterName}に${damage}のダメージ！`)
    } else {
      setMessage(
        `${playerName}のこうげき！ ${monsterName}に${damage}のダメージ！`,
      )
    }
    setSlimeHp((prev) => Math.max(0, prev - damage)) // HPは0未満にならないように

    if (slimeHp - damage <= 0 || playerHp - damage <= 0) {
      setScene("RESULT")
    } else {
      setTurn("SLIME_TURN")
    }
  }

  //魔法攻撃時のダメージ計算
  const handleMagic = () => {
    const isCritical = Math.random() < 0.05 // 5%の確率でクリティカル
    // ダメージ計算ロジック
    let damage = Math.max(0, PLAYER_STATUS.magic - SLIME_STATUS.defense)
    if (isCritical) {
      damage *= 2 // クリティカルならダメージ2倍
      setMessage(`クリティカルヒット！ ${monsterName}に${damage}のダメージ！`)
    } else {
      setMessage(
        `${playerName}のまほう！ ${monsterName}に${damage}のダメージ！`,
      )
    }
    setSlimeHp((prev) => Math.max(0, prev - damage)) // HPは0未満にならないように
    setWizardMp((prev) => Math.max(0, prev - 10)) // 魔法使用でMPを10消費s

    if (slimeHp - damage <= 0 || playerHp - damage <= 0) {
      setScene("RESULT")
    } else {
      setTurn("SLIME_TURN")
    }
  }

  //1.スタート画面
  if (scene === "STRAT") {
    return (
      <div className="game-container">
        <h1>MonsterQuest</h1>
        <button onClick={() => setScene("NAME_INPUT")}>
          ぼうけんを はじめる
        </button>
      </div>
    )
  }

  //2.名前入力画面
  if (scene === "NAME_INPUT") {
    return (
      <div className="game-container">
        <p>なまえを おしえてください</p>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={() => setScene("BATTLE")}>
          このなまえで はじめる
        </button>
      </div>
    )
  }

  //3.バトル画面
  if (scene === "BATTLE") {
    return (
      <div className="game-container">
        ///全体のコンテナ
        {/*画面上部から中央：モンスターエリア*/}
        <div className="monster-area">
          <h2 className="monster-name">{monsterName}</h2>
          <div className="monster-image-placeholder">
            {/* <img src="slime.png" alt="スライム" /> */}
          </div>
        </div>
        {/*画面中央から下部：メッセージウインドウ*/}
        <div className="commnd-block">
          {(turn === "PLAYER_SELECT" || turn === "WIZARD_SELECT") && (
            <div className="command-list">
              <button onClick={handleAttack}>こうげき</button>
              <button disabled>アイテム</button>
              <button disabled>にげる</button>
            </div>
          )}
        </div>
        {/* 2. 勇者ステータスブロック */}
        <div className="status-block">
          <p className="unit-name">{playerName}</p>
          <p>H: {playerHp}</p>
          <p>M: {playerMp}</p>
        </div>
        {/* 3. 魔法使いステータスブロック */}
        <div className="status-block">
          <p className="unit-name">{wizardName}</p>
          <p>H: {wizardHp}</p>
          <p>M: {wizardMp}</p>
        </div>
        {/* 4. メッセージ・詳細ウインドウ */}
        <div className="message-action-block">
          {/* 行動選択中の詳細メニュー */}
          {turn === "PLAYER_SELECT" && (
            <div className="sub-command">
              <p>{playerName}はどうする？</p>
              <div className="btn-group">
                <button onClick={() => executeAction("ATTACK")}>
                  こうげき
                </button>
                <button onClick={() => executeAction("SKILL")}>とくぎ</button>
              </div>
            </div>
          )}
        </div>
        {/* メッセージ表示（自動進行や結果表示用） */}
        {(turn === "SLIME_TURN" ||
          turn === "MESSAGE_WAITING" ||
          scene === "RESULT") && (
          <div className="message-text" onClick={handleMessageClick}>
            {message}
            <span className="next-cursor">▼</span>
          </div>
        )}
        <button onClick={() => setScene("STRAT")}>（デバッグ用）戻る</button>
      </div>
    )
  }
  //デバッグ用
  return <div>終了</div>
}
export { App }
