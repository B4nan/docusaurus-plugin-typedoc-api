// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/templates/reflection.hbs

import React, { useMemo } from 'react';
import { JSONOutput } from 'typedoc';
import { createHierarchy } from '../utils/hierarchy';
import { Comment, hasComment } from './Comment';
import { Hierarchy } from './Hierarchy';
import { Icon } from './Icon';
import { Index } from './Index';
import { Members } from './Members';
import { MemberSignatures } from './MemberSignatures';
import { Parameter } from './Parameter';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface ReflectionProps {
	reflection:
		| JSONOutput.DeclarationReflection
		| JSONOutput.Reflection
		| JSONOutput.SignatureReflection;
}

// TODO:
// - markdown
// eslint-disable-next-line complexity
export function Reflection({ reflection }: ReflectionProps) {
	const hierarchy = useMemo(() => createHierarchy(reflection), [reflection]);

	return (
		<>
			{hasComment(reflection.comment) && (
				<section className="tsd-panel">
					<div className="tsd-panel-content">
						<Comment comment={reflection.comment} />
					</div>
				</section>
			)}

			{'typeParameter' in reflection &&
				reflection.typeParameter &&
				reflection.typeParameter.length > 0 &&
				// Class
				reflection.kind !== 128 && (
					<section className="tsd-panel">
						<h3 className="tsd-panel-header">Type parameters</h3>

						<div className="tsd-panel-content">
							<TypeParameters params={reflection.typeParameter} />
						</div>
					</section>
				)}

			{(('extendedBy' in reflection && reflection.extendedBy && reflection.extendedBy.length > 0) ||
				('extendedTypes' in reflection &&
					reflection.extendedTypes &&
					reflection.extendedTypes.length > 0)) && (
				<section className="tsd-panel">
					<h3 className="tsd-panel-header">Hierarchy</h3>

					<div className="tsd-panel-content">
						<Hierarchy tree={hierarchy} />
					</div>
				</section>
			)}

			{'implementedTypes' in reflection &&
				reflection.implementedTypes &&
				reflection.implementedTypes.length > 0 && (
					<section className="tsd-panel">
						<h3 className="tsd-panel-header">Implements</h3>

						<div className="tsd-panel-content">
							<ul className="tsd-hierarchy">
								{reflection.implementedTypes.map((type) => (
									<li key={type.type}>
										<Type type={type} />
									</li>
								))}
							</ul>
						</div>
					</section>
				)}

			{'implementedBy' in reflection &&
				reflection.implementedBy &&
				reflection.implementedBy.length > 0 && (
					<section className="tsd-panel">
						<h3 className="tsd-panel-header">Implemented by</h3>

						<div className="tsd-panel-content">
							<ul className="tsd-hierarchy">
								{reflection.implementedBy.map((type) => (
									<li key={type.name}>
										<Type type={type} />
									</li>
								))}
							</ul>
						</div>
					</section>
				)}

			{'signatures' in reflection && reflection.signatures && reflection.signatures.length > 0 && (
				<section className="tsd-panel">
					<h3 className="tsd-panel-header tsd-before-signature">Callable</h3>

					<div className="tsd-panel-content">
						<MemberSignatures sigs={reflection.signatures} />
					</div>
				</section>
			)}

			{'indexSignature' in reflection && reflection.indexSignature && (
				<section className="tsd-panel">
					<h3 className="tsd-panel-header tsd-before-signature">Indexable</h3>

					<div className="tsd-panel-content">
						<div className="tsd-signature tsd-kind-icon">
							<Icon reflection={reflection.indexSignature} />
							<span className="tsd-signature-symbol">[</span>
							{reflection.indexSignature.parameters?.map((param) => (
								<span key={param.id}>
									{param.name}
									{': '}
									<Type type={param.type} />
								</span>
							))}
							<span className="tsd-signature-symbol">]: </span>
							<Type type={reflection.indexSignature.type} />
						</div>

						<Comment comment={reflection.indexSignature.comment} />

						<Parameter param={reflection.indexSignature.type?.declaration} />
					</div>
				</section>
			)}

			<Index reflection={reflection} />

			<Members reflection={reflection} />

			<footer className="tsd-footer">
				Powered by{' '}
				<a href="https://github.com/milesj/docusaurus-plugin-typedoc-api">
					docusaurus-plugin-typedoc-api
				</a>{' '}
				and <a href="https://typedoc.org/">TypeDoc</a>
			</footer>
		</>
	);
}
