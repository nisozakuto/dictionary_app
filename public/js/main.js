$(document).ready(function () {
  $("form").submit(async (event) => {
    event.preventDefault();
    $("#word-info").html("Loading...");
    const word = $("#word-input").val();
    console.log(word);
    let wordInfoList = document.querySelector("#word-info");
    try {
      const data = await (
        await fetch(
          `http://localhost:9000/.netlify/functions/getWord?word=${word}`,
          { mode: "cors" }
        )
      ).json();

      if (data.length < 1) {
        return wordInfoList.appendChild(
          document.createTextNode("No results matched")
        );
      }
      $("#word-info").empty();
      data.map((val) => {
        const li = document.createElement("li");
        li.classList.add("my-4", "p-4", "list-item");
        console.log("val", val);
        val.map((property) => {
          if (property.label === "definition") {
            const def = document.createElement("h3");
            def.innerText = property.value;
            def.classList.add(["definition"]);
            li.appendChild(def);
          } else if (property.isString) {
            const partOfSpeech = document.createElement("small");
            partOfSpeech.innerText = property.value;
            partOfSpeech.classList.add("lead", "font-italic");
            li.appendChild(partOfSpeech);
          } else {
            const characteristic = document.createElement("dl");
            characteristic.className = "row";
            const label = document.createElement("dt");
            label.innerText = property.value;
            label.className = "col-sm-3";
            const value = document.createElement("dd");
            value.innerText = property.value.join(", ");
            value.className = "col-sm-9";
            characteristic.appendChild(label);
            characteristic.appendChild(value);
            li.appendChild(characteristic);
          }
        });
        wordInfoList.appendChild(li);
      });
    } catch (e) {
      console.log(e);
      $("#word-info").html("There was an error fetching the word data");
    }
  });
});
