const { spawn } = require("child_process");
const path = require("path");

function runPythonModel(features) {
  return new Promise((resolve, reject) => {
    const projectRoot = path.resolve(__dirname, "../..");
    const scriptPath = path.join(projectRoot, "ml-training", "predict_with_model.py");

    const pythonProcess = spawn(process.env.PYTHON_COMMAND || "python3", [scriptPath], {
      cwd: projectRoot,
    });

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(errorOutput || `Python model exited with code ${code}`)
        );
      }

      try {
        const parsedOutput = JSON.parse(output);
        resolve(parsedOutput);
      } catch (error) {
        reject(new Error("Could not parse Python model output."));
      }
    });

    pythonProcess.stdin.write(JSON.stringify(features));
    pythonProcess.stdin.end();
  });
}

module.exports = {
  runPythonModel,
};