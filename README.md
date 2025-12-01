# The Complexity Paradox of Generalist AI Agents in Medicine: Exploring GPT-5 for Real-World Multimodal Diagnosis 


## Overview


**Motivation**: To evaluate GPT-5 multimodal AI agents for real-world clinical diagnosis, identify key limitations and design gaps in medical-AI deployment, and propose evidence-based recommendations for both technical and clinical communities.
 
**Dataset**: Our dataset is derived from **MedXpertQA**, a publicly available benchmark for Human Health tasks. Our dataset was curated through **physician review and selection**, comprising 161 diagnosis cases spanning 5 body systems. 
 
**Evaluation**: Model performance is assessed across diagnostic accuracy, reasoning quality, web retrieval ability, reliability across capability upgrades, and the impact of low-quality prompts.
 
**Key findings**: Across ten GPT-5 configurations tested on 161 clinician-validated cases, we found consistent limitations in image interpretation, inconsistent or non-corrective web search, and limited transparency in agentic action selection. At the same time, higher-capacity and reasoning-focused models demonstrated strengths in integrating patient history, generating clear stepwise reasoning, producing plausible differential diagnoses, and retrieving relevant supporting evidence. Performance was highly sensitive to input quality.

**Recommendation**: This work indicates that clinically credible AI agents will require improvements in core, auditable reasoning rather than the addition of complex and opaque tool-use layers. Future development should prioritize: (1) auditable, reasoning-first systems that expose transparent traces; (2) redesigning web retrieval to support reflection and error correction rather than confirming initial guesses; (3) enhanced image-grounded reasoning, strengthening the link between visual observations and textual conclusions; (4) practical standards for image quality and prompt clarity, including adequate resolution, reduced noise, and unambiguous clinical queries. Ultimately, the utility of these systems in medicine will depend not on theoretical power but on reliable, robust performance with real-world, imperfect data.

## Main Page


## Authors

- **Shaohui Zhang** - University of Pennsylvania
- **Jiarong Qian** -University of Pennsylvania
- **Kai Zhang** - Lehigh University
- **Zhiling Yan** - Lehigh University
- **Michael A. Catalano** - Hospital of the University of Pennsylvania
- **Kiridly Adam** - Children's Hospital of Philadelphia
- **Omar Toubat** - Hospital of the University of Pennsylvania
- **Gregory E. Tasian** - Children's Hospital of Philadelphia
- **Quanzheng Li** - Massachusetts General Hospital and Harvard Medical School
- **Yonghui Wu** - University of Florida
- **Xing Lei** - Stanford University
- **Wei Liu** - Mayo Clinic
- **Hua Xu** - Yale University
- **Lifang He** - Lehigh University
- **Xiang Li** - Massachusetts General Hospital and Harvard Medical School
- **Zhiyong Lu** - National Center for Biotechnology Information (NCBI)
- **Lichao Sun** - Lehigh University
- **Jing Huang** - University of Pennsylvania


**Affiliations:** University of Pennsylvania, Hospital of the University of Pennsylvania, Lehigh University, University of Florida, Mayo Clinic, Harvard Medical School, Massachusetts General Hospital, Stanford University, Yale University

## Introduction

Generalist artificial intelligence (AI) agents, built on generative pre-trained transformers (GPTs), are increasingly explored in medical tasks, such as patient-to-trial matching, information retrieval, and answering patient’s questions. These applications are largely text based and often involve single-step responses. By contrast, clinical diagnosis requires synthesizing uncertain findings and comparing the cases and external evidence. Existing specialist AI systems are often designed with additional layers of complexity, including enhanced reasoning, incorporation of external knowledge sources, and multi-step, tool-augmented workflows, in order to improve performance. The latest generation AI, exemplified by GPT-5 models, outperforms previous ones by a substantial margin on HealthBench, a realistic open-ended health conversation benchmark. However, in many real-world clinical scenarios, interpreting visual data with the context is central to diagnosis. It remains unclear whether the increased model and agentic complexity in such generalist systems leads to more reliable multimodal diagnosis. Understanding this relationship is important for guiding future deployment and system design for medical AI.

Within ChatGPT ecosystem, GPT-5–based agents offers multiple configurations that differ in model- and system-level complexity. In this case study, we examined ten configurations: (a) a routing baseline (Auto) chooses among backbone models; (b) three “thinking” models (Thinking mini, Thinking, Pro) provide increasing explicit reasoning capacity; (c) each model can be paired with Web Search, yielding retrieval-augmented variants that automatically query external sources during a case; (d) two agentic systems (Agent, Deep Research) orchestrate multi-step plans and tool-augmented workflows. All of these configurations receive the same multimodal clinical inputs but differ in mode, reasoning depth, use of retrieval, and degree of agentic control. This diversity raises a central question for medicine: how do these differences shape diagnostic performance and the reasoning quality of generalist AI agents in multimodal clinical cases?

Existing multimodal benchmarks for medical AI primarily rely on multiple-choice examinations or narrowly scoped image-based questions. Such formats are poorly aligned with the open-ended, dynamic nature of real diagnostic work and offer limited insight into whether models can integrate imaging findings with patient context into a defensible diagnosis. In addition, many recent open-ended evaluations adopted the “model-as-a-judge” strategy, in which one large language model (LLM) scores another AI agents’ answers, but empirical studies have shown that it can diverge from human rating and exhibit systematic biases. To bridge these gaps, we curated an open-ended evaluation set of challenging, real-world multimodal diagnostic cases that require correct interpretation of medical images to reach the diagnosis, iteratively refined a clinician-led scoring rubric, evaluated all ten GPT-5 configurations under identical conditions by multiple qualified clinicians, and conducted detailed error analyses of the models’ output traces to understand how and why generalist agents fail in multimodal diagnosis. 


## Dataset

Our dataset is derived from **MedXpertQA**, a publicly available benchmark for Human Health tasks. Our dataset was curated through **physician review and selection**, comprising 161 diagnosis cases spanning 5 body systems:

- **Cardiovascular**: 40 cases
- **Digestive**: 34 cases  
- **Respiratory**: 34 cases
- **Skeletal**: 31 cases
- **Nervous**: 22 cases


Each case has a unique identifier and an open-ended, reasoning-style diagnostic question paired with medical images spanning CT, MRI, X-ray, PET, pathology images, EEG/ECG recordings, charts, and real-world photographs, together with a clinically validated ground-truth diagnosis.

## Leaderboard

**GPT-5 model family** accuracy on 161 open-ended diagnosis cases (human adjudication):

| Category | Model | Accuracy |
|----------|-------|----------|
| **LLM** | Auto | 0.3850 |
| | Thinking mini | 0.3292 |
| | Thinking | 0.4161 |
| | **Pro** | **0.4596** |
| **Web-Search** | Auto Web Search | 0.2671 |
| | Thinking mini Web Search | 0.3478 |
| | Thinking Web Search | 0.4410 |
| | **Pro Web Search** | **0.4658** |
| **Agent** | ChatGPT Agent | 0.3664 |
| | Deep Research | 0.2981 |

These results highlight the importance of combining deeper reasoning with disciplined retrieval: the `Pro` variants maintain the highest accuracy, web search brings only modest gains, and `Auto` drops by 0.1179 when retrieval is enabled.

## Physician Judge Criteria

We co-designed a six-dimension rubric with clinicians and present it on the website as a matrix. Each diagnosis is adjudicated as **✓ / Δ / ✗** (fully meets / partially meets / violates) against the following criteria:

- **Matches clinical evidence**: aligns with history, examination findings, and imaging evidence.
- **Clinical reasoning tolerance**: reasoning must remain professional and coherent; generic reasoning receives Δ, contradictions receive ✗.
- **Correct site / polarity**: specifies the correct anatomical site, laterality, and presence/absence descriptors.
- **On topic (no hallucination)**: avoids fabricating tests or facts; answers must stay focused on the case.
- **Diagnostic granularity tolerance**: accepts interchangeable parent/subtype diagnoses; semantic mismatches receive ✗.
- **Minor / format difference**: allows slight wording or formatting differences without altering medical meaning.

## Examples

The homepage carousels feature four representative groups of case studies to illustrate performance patterns we observed:

- **Case studies on the strengths of LLMs**
- **Misclassification and partial-credit cases**
- **Case studies on the limitations of web search**
- **Case studies on the limitations of agents**

## Model Information

Model versions and test dates for August 2025:

| Model Version | Auto (GPT-5) | Thinking mini | Thinking | Pro | Auto Web Search |
|---------------|--------------|---------------|----------|-----|-----------------|
| Test Date (mm.dd.2025) | 08.09 | 08.30 | 08.09–08.10 | 08.09 | 08.11 |

| Model Version | Thinking mini Web Search | Thinking Web Search | Pro Web Search | Deep Research | Agent |
|---------------|--------------------------|---------------------|----------------|---------------|-------|
| Test Date (mm.dd.2025) | 08.16 | 08.11 | 08.10 | 08.14–08.20 | 08.11–08.13 |

> Note: As of August 9, 2025, `ChatAuto` has been renamed to `ChatGPT-5 Auto`.

## BibTeX

If you use this project in your research, please cite:

```bibtex
@inproceedings{2025_gpt5_evaluate,
  title={The Complexity Paradox of Generalist AI Agents in Medicine: Exploring GPT-5 for Real-World Multimodal Diagnosis },
  author={Shaohui Zhang, Jiarong Qian, Kai Zhang, Zhiling Yan, Michael A. Catalano, Kiridly Adam, Omar Toubat, Gregory E. Tasian, Quanzheng Li, Yonghui Wu, Xing Lei, Wei Liu, Hua Xu, Lifang He, Xiang Li, Zhiyong Lu, Lichao Sun, Jing Huang},
  booktitle={},
  year={2025},
}
```

## License

This project is for research and educational purposes. Please ensure compliance with relevant data privacy and medical research regulations when using the MedXpertQA dataset.

---

*This benchmark aims to establish a rigorous methodology for tracking progress and guiding the responsible development of AI towards a future of safe and reliable clinical support systems.*
