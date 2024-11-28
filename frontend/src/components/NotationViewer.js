import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter } from "vexflow";

function NotationViewer({ musicXmlPath }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!musicXmlPath) return;

    const renderNotation = async () => {
      const response = await fetch(musicXmlPath);
      const musicData = await response.text();

      // Example rendering of static notes (replace with MusicXML parsing)
      const vf = new Renderer(containerRef.current, Renderer.Backends.SVG);
      vf.resize(500, 200);
      const context = vf.getContext();
      const stave = new Stave(10, 40, 400);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      const notes = [
        new StaveNote({ keys: ["c/4"], duration: "q" }),
        new StaveNote({ keys: ["d/4"], duration: "q" }),
        new StaveNote({ keys: ["e/4"], duration: "q" }),
        new StaveNote({ keys: ["f/4"], duration: "q" }),
      ];

      Formatter.FormatAndDraw(context, stave, notes);
    };

    renderNotation();
  }, [musicXmlPath]);

  return <div ref={containerRef} />;
}

export default NotationViewer;