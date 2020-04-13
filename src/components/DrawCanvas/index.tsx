import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { connect } from "react-redux";
import { Room } from "colyseus.js";
import useInterval from "@use-it/interval";

import { ActionType } from "../../store/reducer";

import "./DrawCanvas.css";

enum Tool {
  Pencil,
  Eraser,
}

export interface Props {
  word: string;
  room: Room;
  owner: string;
}

const DrawCanvas = (props: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const timeAllowed = 60;

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<
    [number | null, number | null]
  >([null, null]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<Tool>(Tool.Pencil);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeAllowed);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitDrawing();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    canvas.current.width = canvas.current.getBoundingClientRect().width;
    canvas.current.height = canvas.current.getBoundingClientRect().height;

    const ctx = canvas.current.getContext("2d");
    setContext(ctx);

    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    }
  }, []);

  useInterval(() => {
    setTimeLeft(timeLeft - 1);
  }, 1000);

  const onMouseDown = (event: MouseEvent) =>
    onStartDraw(event.offsetX, event.offsetY);

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.targetTouches[0];
    const target = event.target as HTMLElement;
    const x = touch.clientX - target.offsetLeft;
    const y = touch.clientY - target.offsetTop;

    onStartDraw(x, y);
  };

  const onStartDraw = (x: number, y: number) => {
    setLastPosition([x, y]);
    setIsDrawing(true);
  };

  const onMouseUp = () => setIsDrawing(false);
  const onMouseMove = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    onMove(offsetX, offsetY);
  };

  const onTouchMove = (event: TouchEvent) => {
    const { clientX, clientY } = event.targetTouches[0];
    const { offsetTop, offsetLeft } = event.target as HTMLElement;
    onMove(clientX - offsetLeft, clientY - offsetTop);
  };

  const onMove = (x: number, y: number) => {
    if (lastPosition[0] === null || lastPosition[1] === null) {
      return;
    }

    if (isDrawing && context !== null) {
      switch (tool) {
        case Tool.Pencil:
          context.lineWidth = 2;
          context.strokeStyle = "#000";
          context.beginPath();
          context.moveTo(lastPosition[0], lastPosition[1]);
          context.lineTo(x, y);
          context.stroke();
          context.closePath();
          setLastPosition([x, y]);
          break;
        case Tool.Eraser:
          context.beginPath();
          context.strokeStyle = "#fff";
          context.fillStyle = "#fff";
          context.arc(x - 10, y - 10, 20, 0, Math.PI * 2);
          context.fill();
          break;
      }
    }
  };

  const clear = () => {
    if (context && canvas.current) {
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.current.width, canvas.current.height);
    }
  };

  const submitDrawing = () => {
    if (canvas.current) {
      const url = canvas.current.toDataURL("image/png");
      props.room.send({
        type: "submitDrawing",
        imageDataUrl: url,
      });
      setIsSubmitted(true);
    }
  };

  const renderTimer = () => {
    const showWarning = timeLeft <= 10;
    const classA = timeLeft % 2 === 0;
    const classB = timeLeft % 2 === 1;

    return (
      <div
        className={`TimeLeft ${showWarning && classA && "WarningA"} ${
          showWarning && classB && "WarningB"
        }`}
      >
        {timeLeft}
      </div>
    );
  };

  return (
    <div className="DrawCanvas">
      {!isSubmitted && renderTimer()}
      <div>You are drawing</div>
      <div className="DrawLabel">{props.word}</div>
      {!isSubmitted && (
        <>
          <canvas
            ref={canvas}
            onMouseDown={(e) => onMouseDown(e.nativeEvent)}
            onMouseUp={() => onMouseUp()}
            onMouseMove={(e) => onMouseMove(e.nativeEvent)}
            onTouchStart={(e) => onTouchStart(e.nativeEvent)}
            onTouchMove={(e) => onTouchMove(e.nativeEvent)}
          ></canvas>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
          >
            <Button
              variant={tool === Tool.Pencil ? "outlined" : "contained"}
              onClick={() => setTool(Tool.Pencil)}
            >
              Pencil
            </Button>
            <Button
              variant={tool === Tool.Eraser ? "outlined" : "contained"}
              onClick={() => setTool(Tool.Eraser)}
            >
              Eraser
            </Button>
          </ButtonGroup>
          <Button
            onClick={() => submitDrawing()}
            color="primary"
            variant="contained"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            Submit
          </Button>
          <Button
            onClick={() => clear()}
            color="secondary"
            variant="contained"
            style={{ width: "100%" }}
          >
            Clear
          </Button>
        </>
      )}
      {isSubmitted && (
        <div className="DrawWaitMessage">Waiting for other submissions...</div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setDrawingUrl: (url: string) => {
      dispatch({
        type: ActionType.SetDrawingUrl,
        payload: {
          url,
        },
      });
      dispatch({
        type: ActionType.SetGameState,
        payload: {
          gameState: 1,
        },
      });
    },
  };
};

export default connect((state: any) => ({}), mapDispatchToProps)(DrawCanvas);
