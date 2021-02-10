<template>
  <div id="app" class="flex flex-col h-screen p-5 overflow-hidden bg-blue-100">
    <div
      class="w-full p-4 mb-5 font-mono text-3xl underline bg-white rounded shadow"
    >
      Email
      <span class="font-bold text-gray-500">Personaliser</span>
    </div>
    <div class="font-mono">
      <textarea
        ref="csv-data-formatter"
        onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"
        placeholder="paste tab-separated values here. Headers will be used as placeholder in the input textbox below..."
        class="w-full p-4 font-mono text-sm text-gray-500 bg-gray-900 rounded"
        v-model="rawTsvData"
        rows="10"
      ></textarea>
    </div>

    <div class="flex items-stretch flex-grow h-2 p-5 bg-white rounded shadow">
      <div class="flex flex-col flex-grow my-10 font-mono rounded">
        Enter mail here (use moustache syntax to dynamically inject data from the input above)
        <div
          id="divEditor"
          class="inline-block w-1/2 p-5 m-0 my-5 overflow-y-auto border border-blue-300 border-solid rounded h-96"
          contenteditable="true"
          @input="updateHtml"
        ></div>
        <!-- ref="editableDiv" -->
        <div class="flex flex-row w-full p-2 my-10 font-mono text-sm">
          <input
            v-model="postEndpoint"
            type="text"
            class="self-stretch flex-grow w-full p-2 mr-4 text-xs border rounded"
            placeholder="handler url (e.g. https://app.com/users/sendmail)"
          />
          <input
            v-model="uuid"
            type="text"
            class="self-stretch flex-grow w-full p-2 mr-4 border rounded"
            placeholder="enter name of unique header"
            title="name of the header that is unique in the rows of data"
          />
          <button
            @click="sendCustomizedEmail()"
            class="self-stretch w-full p-3 px-4 py-2 font-serif text-xl font-bold text-blue-900 bg-blue-100 border-2 rounded shadow hover:text-white hover:bg-blue-500 focus:shadow-outline focus:outline-none"
          >
            {{ button_text }}
          </button>
        </div>
      </div>
      <div
        class="relative flex-grow ml-5 overflow-hidden font-mono text-xs bg-blue-100 border rounded shadow"
      >
        <div class="p-4 text-white bg-blue-900">
          Index of the row to render (defaults to randomly render any row):
          <input
            type="number"
            min="1"
            ref="renderedRow"
            v-model="indexOfRowToRender"
            class="p-2 text-blue-900 border"
          />
        </div>
        <!-- @keyup="renderThisRow" -->
        <div
          v-html="builtSampleOutput"
          class="absolute w-full h-full p-4 overflow-y-auto font-mono text-xs bg-blue-100 rounded text-grey-300"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
/*
//Can't use tinymce because https://github.com/tinymce/tinymce-vue/issues/81#issuecomment-776482330
//When we use something like below, normal development works, but when compiled as web component, css style breaks
import wysiwyg from "vue-wysiwyg";
import "~vue-wysiwyg/dist/vueWysiwyg.css";
import Vue from "vue";
Vue.use(wysiwyg, {}); // config is optional. more below
*/

import Faker from "./lib/faker";

//TODO: use sweetlaert for popoups and submit this to "built with sweetlaert"

export default {
  props: ["defaultPostEndpoint"],
  data() {
    return {
      postEndpoint: "",
      uuid: "email",
      indexOfRowToRender: null,
      rawTsvData: `sn\tname\temail\tphone\taddress\n`,
      mailTemplate: "",
      builtSampleOutput: "",
      uuid_index: 0,
      button_text: "Submit",
      divEditor: null,
    };
  },
  mounted: function () {
    if (this.defaultPostEndpoint) {
      this.postEndpoint = this.defaultPostEndpoint;
    }

    let defaultTemplate = `Hello, <b><i>{{name}}</i></b>.<br><br>Can we call you on <b><u>{{phone}}</u></b>?`;
    this.mailTemplate = defaultTemplate;
    this.divEditor = document.querySelector("#divEditor");
    this.divEditor.innerHTML = defaultTemplate;

    this.evaluate_uuid_index();
    //now randomly generate stuff
    let data = this.rawTsvData;
    for (let index = 1; index <= 2; index++) {
      data +=
        [
          index,
          Faker.name(),
          Faker.internet(),
          Faker.phoneNumber(),
          Faker.address(),
        ].join("\t") + "\n";
    }

    this.rawTsvData = data;

    //display sample
    this.builtSampleOutput = this.buildMessageFromTemplate(
      this.splittedTrimmedDataRows[1].split("\t"),
      this.mailTemplate,
      this.tsvHeaders
    );

    this.$nextTick(
      (() => {
        this.$refs["csv-data-formatter"].focus();
      }).bind(this)
    );
  },
  computed: {
    splittedTrimmedDataRows: function () {
      return this.trimmedTsvData.split("\n");
    },
    trimmedTsvData: {
      get: function () {
        return this.rawTsvData.trim();
      },
      set: function () {
        this.updateCurrentlyDisplayedSampleTemplate();
      },
    },
    tsvHeaders: function () {
      //array of headers: from the first row
      if (
        this.splittedTrimmedDataRows &&
        this.splittedTrimmedDataRows.length >= 1
      ) {
        //in my experience, this lib caused some time wastage becuase there was a terrible failure that happended due to space preceeding an header name
        let splits = this.splittedTrimmedDataRows[0].split("\t");
        return splits.map((item) => item.trim());
      }

      return [];
    },
  },
  watch: {
    uuid: function () {
      this.evaluate_uuid_index();
    },

    mailTemplate: function () {
      this.updateCurrentlyDisplayedSampleTemplate();
    },
    indexOfRowToRender: function () {
      this.updateCurrentlyDisplayedSampleTemplate();
    },
    rawTsvData: function () {
      this.updateCurrentlyDisplayedSampleTemplate();
      this.evaluate_uuid_index();
    },
  },
  methods: {
    updateHtml: function () {
      let html = this.divEditor.innerHTML || this.divEditor.innerText;

      if (html) {
        this.mailTemplate = html;
      }
    },
    evaluate_uuid_index: function () {
      this.uuid_index = this.tsvHeaders.indexOf(this.uuid);
    },
    updateCurrentlyDisplayedSampleTemplate: function () {
      let renderedRow = this.indexOfRowToRender;

      if (!!renderedRow == false) {
        renderedRow = getRandomIntInclusive(
          1,
          this.splittedTrimmedDataRows.length - 1
        );
      }

      let tmp = this.buildMessageFromTemplate(
        //TODO: check that index exists
        this.splittedTrimmedDataRows[renderedRow].split("\t"),
        this.mailTemplate,
        this.tsvHeaders
      );
      this.builtSampleOutput = tmp;
    },
    buildMessageFromTemplate: function (
      rawStringArray,
      template,
      replacementHeaders
    ) {
      var finalBuild = template;
      try {
        //replace all headers with it's moustache in template
        for (let index = 0; index < replacementHeaders.length; index++) {
          let replacement = new RegExp(
            `{{${replacementHeaders[index]}}}`,
            "gi"
          );
          finalBuild = finalBuild.replace(replacement, rawStringArray[index]);
        }
      } catch (error) {
        //sample thing we catch here is when rawStringArray and replacementHeaders erroneously have different lengths
        alert(error);
      }
      return finalBuild;
    },
    getAllCustomizedEmails: function () {
      var customizedEmails = {};

      //start from index 1: skip the headers
      for (
        let index = 1;
        index < this.splittedTrimmedDataRows.length;
        index++
      ) {
        // debugger;
        let dataRowArray = this.splittedTrimmedDataRows[index].split("\t");
        customizedEmails[
          dataRowArray[this.uuid_index]
        ] = this.buildMessageFromTemplate(
          dataRowArray,
          this.mailTemplate,
          this.tsvHeaders
        );
      }

      return customizedEmails;
    },
    sendCustomizedEmail: function () {
      let all = this.getAllCustomizedEmails();
      // debugger;
      // format for display
      let demacation = "--------------------";
      this.builtSampleOutput = "";
      Object.values(all).forEach((value) => {
        // debugger;
        this.builtSampleOutput += `<br>${value}<br>${demacation}<br>${all[value]}<br><br>`;
      });

      // TODO: ensure no sending session going on - singleton sending
      this.button_text = "Sending...";
      postData(this.postEndpoint, all)
        .then((data) => alert(data)) // JSON from `response.json()` call
        .catch((error) => alert(error))
        .finally(() => (this.button_text = "Submit"));
    },
  },
};

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
      "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
        ? document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content")
        : "",
    },
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // *client, no-referrer
  }).then((response) => response.text()); // parses response to JSON
}

function getRandomIntInclusive(min, max) {
  // debugger
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.mce-edit-area,
iframe {
  height: 100% !important;
}

.mce-container-body.mce-stack-layout {
  height: 70% !important;
}

.tox-notification {
  display: none !important;
}
</style>

<style>
@tailwind utilities;
</style>
